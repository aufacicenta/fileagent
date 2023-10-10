import { APIChatHeaderKeyNames, FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";
import { ApiError } from "square";

import { ChatCompletionChoice, get_square_payments_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import { SquareAPILabel } from "context/message/MessageContext.types";
import square from "providers/square";
import date from "providers/date";
import json from "providers/json";
import openai from "providers/openai";

const get_square_payments = async (
  args: get_square_payments_args,
  choice: ChatCompletionChoice,
  _currentMessage: FileAgentRequest["currentMessage"],
  request: NextApiRequest,
): Promise<ChatCompletionChoice> => {
  try {
    logger.info(`get_square_payments: ${JSON.stringify(args)}`);

    const accessToken = request.headers[APIChatHeaderKeyNames.x_square_access_token] as string;

    if (!accessToken) {
      return square.getSquareAuthChoice(choice);
    }

    const beginTime = args?.begin_time ? date.client(args?.begin_time).toDate().toISOString() : undefined;
    const endTime = args?.end_time ? date.client(args?.end_time).toDate().toISOString() : undefined;

    const response = await square
      .getClient(accessToken)
      .paymentsApi.listPayments(
        beginTime,
        endTime,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        5,
      );

    if (!response.result.payments) {
      return {
        finish_reason: "function_call",
        index: 0,
        message: {
          role: "assistant",
          content: `You have no Square payments for this range.`,
          type: "text",
          label: SquareAPILabel.square_get_payments_request_success,
        },
      };
    }

    const filteredPaymentsFields = response.result.payments;

    const chatCompletion = await openai.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Given this JSON data:

${JSON.stringify(filteredPaymentsFields, json.replacer, 2)}

What is the total amount of all payments?`,
        },
      ],
      model: openai.model,
    });

    const [prediction] = chatCompletion.choices;

    return {
      ...prediction,
      message: {
        ...prediction.message,
        type: "text",
        label: SquareAPILabel.square_get_payments_request_success,
      },
    };
  } catch (error) {
    logger.error(error);

    if (
      error instanceof ApiError &&
      error.errors &&
      error.errors?.filter((e) => e.code === "UNAUTHORIZED").length > 0
    ) {
      return square.getSquareAuthChoice(choice);
    }

    throw error;
  }
};

export default get_square_payments;
