import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

import { ChatFormValues } from "app/chat/dropbox-chat/DropboxChat.types";
import logger from "providers/logger";

const model = "gpt-3.5-turbo";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`getting chat completion from model ${model}`);

    const data: ChatFormValues = JSON.parse(request.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: data.message }],
      model,
    });

    response.status(200).json({ choices: chatCompletion.choices });
  } catch (error) {
    logger.error(error);

    response.status(500).json({ error: (error as Error).message });
  }
}
