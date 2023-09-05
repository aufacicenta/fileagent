import { DropboxESignRequest } from "api/chat/types";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat";

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
    logger.info(`extract_content_from_pdf_file; ${args}`);

    const { signedUrl } = await supabase.createSignedURL("user", args.file_name, 60);

    const ocrResult = await nanonets.getFullTextOCR(signedUrl, signedUrl);

    let maxTokens = 0;

    logger.info(`extract_content_from_pdf_file; mapping messages. maxTokens: ${maxTokens}`);

    const messages = ocrResult.results[0].page_data
      .map((data) => {
        maxTokens += data.words.length;

        if (maxTokens > 70000) {
          return null;
        }

        return {
          role: "user",
          content: data.raw_text,
        };
      })
      .filter(Boolean) as CreateChatCompletionRequestMessage[];

    logger.info(`extract_content_from_pdf_file; getting chatCompletions. maxTokens: ${maxTokens}`);

    const chatCompletions = await Promise.all(
      messages.map((message) =>
        openai.client.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `${currentMessage.content}

      ${message.content}`,
            },
          ],
          model: openai.model,
        }),
      ),
    );

    logger.info(`extract_content_from_pdf_file; got chatCompletions. choices: ${chatCompletions.length}`);

    const content = chatCompletions.map((chatCompletion) => chatCompletion.choices[0].message.content).join("\n");

    return {
      ...chatCompletions[0].choices[0],
      message: {
        role: "assistant",
        content,
      },
    };
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
