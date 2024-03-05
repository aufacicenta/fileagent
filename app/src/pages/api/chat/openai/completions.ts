import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import logger from "providers/logger";
import chat from "providers/chat";
import openai from "providers/openai";
import { ChatLabel } from "context/message/MessageContext.types";
import { FileAgentRequest } from "../types";
import json from "providers/json";

import functions from "./functions";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`getting chat completion from model ${openai.model}`);

    const data: FileAgentRequest = (() => {
      if (request.body?.currentMessageMetadata?.source === "messagebird") {
        return {
          ...request.body,
          messages: [
            {
              role: "user",
              content: "",
            },
          ],
        };
      }

      if (typeof request.body.body === "string") {
        return JSON.parse(request.body.body, json.reviver);
      }

      return request.body.body;
    })();

    const chatCompletion = await openai.client.chat.completions.create({
      messages: [
        { role: "system", content: "You are an intelligent file reader. You can understand the content of any file." },
        ...data.messages,
        data.currentMessage,
      ],
      model: openai.model,
      functions,
    });

    logger.info(chatCompletion);

    const { choices, promises } = chat.processFunctionCalls(chatCompletion.choices);

    if (promises.length > 0) {
      const responses = await Promise.all(promises.map((promise) => promise(data.currentMessage, request)));

      response.status(200).json({ choices: responses });

      return;
    }

    if (data.currentMessageMetadata?.source === "messagebird") {
      await axios({
        method: "PATCH",
        url: "https://api.bird.com/workspaces/305b8974-7995-4878-a7b9-9c426cec8e17/flows/f543bea1-11d9-4893-9ac3-e97ec9e2baca/runs",
        headers: {
          Authorization: `AccessKey tz8si6wlFuTjOWUPiqDMgr9NV0bKpOrHFaXu`,
          "Content-Type": "application/json",
        },
        data: {
          action: "resume",
          resumeKey: "f3561227-7aa8-4d3f-baf8-3759fd2db462",
          resumeExtraInput: {
            choices,
          },
        },
      });
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
