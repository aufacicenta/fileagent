import { DropboxESignRequest } from "api/chat/types";

import { ChatCompletionChoice, extract_content_from_pdf_file_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import openai from "providers/openai";
import supabase from "providers/supabase";
import nanonets from "providers/nanonets";

const extract_content_from_pdf_file = async (
  args: extract_content_from_pdf_file_args,
  choice: ChatCompletionChoice,
  currentMessage: DropboxESignRequest["currentMessage"],
): Promise<ChatCompletionChoice> => {
  try {
    logger.info("extract_content_from_pdf_file", args);

    const { signedUrl } = await supabase.createSignedURL("user", args.file_name, 60);

    const ocrResult = await nanonets.getFullTextOCR(signedUrl, signedUrl);

    const raw_text = nanonets.getRawText(ocrResult);

    // @TODO throw a max tokens error when length is above 4097
    // OpenAI limits this model to 4097 tokens and will throw
    // labels: 100 USDT
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
