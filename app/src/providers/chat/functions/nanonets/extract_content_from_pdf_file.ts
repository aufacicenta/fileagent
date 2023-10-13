import { FileAgentRequest } from "api/chat/types";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat";
import { NextApiRequest } from "next";

import { ChatCompletionChoice, extract_content_from_pdf_file_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import openai from "providers/openai";
import supabase from "providers/supabase";
import nanonets from "providers/nanonets";
import { ChatLabel } from "context/message/MessageContext.types";
import sequelize from "providers/sequelize";

const extract_content_from_pdf_file = async (
  args: extract_content_from_pdf_file_args,
  choice: ChatCompletionChoice,
  currentMessage: FileAgentRequest["currentMessage"],
  request: NextApiRequest,
): Promise<ChatCompletionChoice> => {
  try {
    const body = JSON.parse(request.body.body);

    const bucketName = body.currentMessageMetadata?.bucketName;

    const fileName = `${bucketName}/${args.file_name}`;

    logger.info(`extract_content_from_pdf_file; ${fileName}`);

    const { signedUrl } = await supabase.storage.createSignedURL(bucketName!, args.file_name, 60);

    // @TODO Store getFullTextOCR result in the database, linked to the user
    // labels: 500 USDT, P1
    const ocrResult = await nanonets.getFullTextOCR(signedUrl, signedUrl);

    const rawText = ocrResult.results[0].page_data.map((data) => data.raw_text).join("\n");

    const { ContentExtraction } = await sequelize.load();

    await ContentExtraction.create({
      fileName,
      content: rawText,
    });

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
        type: "text",
        label: ChatLabel.chat_extract_pdf_success,
      },
    };
  } catch (error) {
    logger.error(error);

    return {
      ...choice,
      message: {
        ...choice.message,
        content: "Sorry, I couldn't extract the content from the PDF file.",
        label: ChatLabel.chat_extract_pdf_error,
      },
    };
  }
};

export default extract_content_from_pdf_file;
