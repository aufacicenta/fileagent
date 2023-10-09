import { APIChatHeaderKeyNames, FileAgentRequest, FileAgentResponse } from "api/chat/types";
import { NextApiRequest } from "next";
import { ApiError } from "square";
import axios from "axios";

import { ChatCompletionChoice, get_square_payments_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import { SquareAPILabel } from "context/message/MessageContext.types";
import square from "providers/square";
import { routes } from "hooks/useRoutes/useRoutes";
import date from "providers/date";

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

    const response = await square.getClient(accessToken).paymentsApi.listPayments(beginTime, endTime);

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

    const { messages } = JSON.parse(request.body);

    const parsePaymentsRequest = await axios.post<FileAgentResponse, FileAgentResponse, FileAgentRequest>(
      routes.api.chat.googleai.completionsAPI(),
      {
        messages,
        currentMessage: {
          role: "user",
          type: "text",
          content: `Given this JSON data: ${JSON.stringify(response.result.payments, (_key, value) =>
            typeof value === "bigint" ? `BIGINT::${value}` : value,
          )}, what is the total amount of all payments?`,
        },
      },
      {
        headers: {
          [APIChatHeaderKeyNames.x_square_access_token]: accessToken,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      ...parsePaymentsRequest.choices[0],
      message: {
        ...parsePaymentsRequest.choices[0].message,
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
