import { APIChatHeaderKeyNames, FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";
import { ApiError } from "square";
import { helpers } from "@google-cloud/aiplatform";

import { ChatCompletionChoice, get_square_payments_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import { SquareAPILabel } from "context/message/MessageContext.types";
import square from "providers/square";
import date from "providers/date";
import json from "providers/json";
import googleai from "providers/googleai";
import { GoogleAIPrediction } from "providers/googleai/googleai.types";
import transformGoogleAIPredictionResponseToStandardChoice from "../../normalize-googleai-prediction-response";

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

    const prompt = {
      prompt: `Given this JSON data:

${JSON.stringify(response.result.payments, json.replacer, 2)}

What is the total amount of all payments?`,
    };

    const [predictionResponse] = await googleai.predict(prompt, googleai.getEndpoint({ model: "text-bison-32k" }));

    if (!predictionResponse?.predictions) {
      throw new Error("No prediction response");
    }

    const prediction = helpers.fromValue((predictionResponse.predictions as protobuf.common.IValue[])[0]);

    const [normalizedChoice] = transformGoogleAIPredictionResponseToStandardChoice(prediction as GoogleAIPrediction);

    return {
      ...normalizedChoice,
      message: {
        ...normalizedChoice.message,
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