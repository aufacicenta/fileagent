import { NextApiRequest, NextApiResponse } from "next";
import aiplatform, { helpers } from "@google-cloud/aiplatform";

import logger from "providers/logger";
import { ChatLabel } from "context/message/MessageContext.types";
import { FileAgentRequest } from "../types";
import { FunctionCallName } from "providers/chat/chat.types";
import chat from "providers/chat";
import { GoogleAIPrediction } from "providers/googleai/googleai.types";

const { PredictionServiceClient } = aiplatform.v1;
const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
};
const publisher = "google";
// const model = "text-bison@001";
const model = "chat-bison@001";
const project = process.env.GOOGLE_PROJECT_ID;
const location = "aufacicenta.com";
const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`getting googleai chat completion from model ${model}`);

    const data: FileAgentRequest = JSON.parse(request.body);

    const predictionServiceClient = new PredictionServiceClient(clientOptions);

    const messages = data.messages.map((message) => ({ author: message.role, content: message.content }));

    if (messages[messages.length - 1].author === "user" && data.currentMessage.role === "user") {
      messages.push({ author: "assistant", content: "Continue the conversation..." });
    }

    messages.push({ author: data.currentMessage.role, content: data.currentMessage.content });

    const prompt = {
      context: `You are an intelligent file reader. You can understand the content of any file. If the prompt matches the examples, you should format the reply as a JSON function_call. If the prompt implies a date, replace YYYYMMDD with the implied date and format the date as YYYYMMDD.`,
      messages,
      examples: [
        {
          input: { content: "List all my Square locations" },
          output: {
            content: `{"function_call": { "name": "${FunctionCallName.get_square_locations}", "arguments": { "file_name": "filename" } } }`,
          },
        },
        {
          input: { content: "Get all my square orders of this month" },
          output: {
            content: `{"function_call": { "name": "${FunctionCallName.get_square_orders}", "arguments": { "date_time_filter": { "created_at": "YYYYMMDD" } } } }`,
          },
        },
      ],
    };

    const instanceValue = helpers.toValue(prompt);
    const instances = [instanceValue] as protobuf.common.IValue[];

    const parameter = {
      temperature: 1,
      maxOutputTokens: 1000,
      topP: 0.95,
      topK: 40,
    };

    const parameters = helpers.toValue(parameter);

    const [predictionResponse] = await predictionServiceClient.predict({
      endpoint,
      instances,
      parameters,
    });

    if (!predictionResponse?.predictions) {
      throw new Error("No prediction response");
    }

    const prediction = helpers.fromValue((predictionResponse.predictions as protobuf.common.IValue[])[0]);

    const normalizedChoices = chat.transformGoogleAIPredictionResponseToStandardChoice(
      prediction as GoogleAIPrediction,
    );

    const { choices, promises } = chat.processFunctionCalls(normalizedChoices);

    if (promises.length > 0) {
      const responses = await Promise.all(promises.map((promise) => promise(data.currentMessage, request)));

      response.status(200).json({ choices: responses });

      return;
    }

    response.status(200).json({ choices });
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
      choices: [
        {
          message: {
            role: "assistant",
            content: "Apologies, I couldn't resolve this request. Try again.",
            label: ChatLabel.chat_completion_error,
            readOnly: true,
            type: "text",
          },
        },
      ],
    });
  }
}
