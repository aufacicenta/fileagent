import { NextApiRequest, NextApiResponse } from "next";

import logger from "providers/logger";
import { FunctionCallName } from "providers/chat/chat.types";
import chat from "providers/chat";
import openai from "providers/openai";

import { DropboxESignRequest } from "./types";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`getting chat completion from model ${openai.model}`);

    const data: DropboxESignRequest = JSON.parse(request.body);

    const chatCompletion = await openai.client.chat.completions.create({
      messages: [
        { role: "system", content: "You are an intelligent file reader. You can understand the content of any file." },
        ...data.messages,
        data.currentMessage,
      ],
      model: openai.model,
      functions: [
        {
          name: FunctionCallName.extract_content_from_pdf_file,
          description: "Only if there is a .pdf extension, get the full text of the file and explain it.",
          parameters: {
            type: "object",
            properties: {
              file_name: {
                type: "string",
                description: "The name of a PDF file, e.g. a-file.pdf",
              },
              unit: { type: "string" },
            },
            required: ["file_name"],
          },
        },
      ],
    });

    logger.info(chatCompletion);

    const { choices, promises } = chat.processFunctionCalls(chatCompletion.choices);

    if (promises.length > 0) {
      const responses = await Promise.all(promises.map((promise) => promise(data.currentMessage)));

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
          },
        },
      ],
    });
  }
}
