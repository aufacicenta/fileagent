import OpenAI from "openai";
import { DropboxESignRequest } from "api/chat/types";

import { extract_content_from_pdf_file_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import openai from "providers/openai";
import supabase from "providers/supabase";
import nanonets from "providers/nanonets";

const extract_content_from_pdf_file = async (
  args: extract_content_from_pdf_file_args,
  choice: OpenAI.Chat.ChatCompletion.Choice,
  currentMessage: DropboxESignRequest["currentMessage"],
): Promise<OpenAI.Chat.ChatCompletion.Choice> => {
  try {
    logger.info("extract_content_from_pdf_file", args);

    const { signedUrl } = await supabase.createSignedURL("user", args.file_name, 60);

    const ocrResult = await nanonets.getFullTextOCR(signedUrl, signedUrl);

    const raw_text = nanonets.getRawText(ocrResult);

    const chatCompletion = await openai.client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `${currentMessage.content}

            ${raw_text}`,
        },
      ],
      model: openai.model,
    });

    return chatCompletion.choices[0];
  } catch (error) {
    logger.error(error);

    return {
      ...choice,
      message: {
        ...choice.message,
        content: "Sorry, I couldn't extract the content from the PDF file.",
      },
    };
  }
};

export default extract_content_from_pdf_file;
