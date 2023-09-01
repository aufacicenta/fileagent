import OpenAI from "openai";

import { extract_content_from_pdf_file_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import openai from "providers/openai";
import supabase from "providers/supabase";
import nanonets from "providers/nanonets";

const extract_content_from_pdf_file = async (
  args: extract_content_from_pdf_file_args,
  choice: OpenAI.Chat.ChatCompletion.Choice,
): Promise<OpenAI.Chat.ChatCompletion.Choice> => {
  try {
    console.log("extract_content_from_pdf_file", args);

    // @TODO download file from storage and upload to nanonets
    // labels: 500 USDT, P1
    // const file =
    //   "https://blockchainassetregistry.infura-ipfs.io/ipfs/bafybeidxxuzx6ht6qz3chhxtmyo2dhya7ykes2mo7gqptpwphvnkzptx3y/DERECHOS-INSCRIPCION-35295_249_184_3_9_22-08-2023%2016.21.06.pdf.pdf";

    const { signedUrl } = await supabase.createSignedURL("user", args.file_name, 60);

    const ocrResult = await nanonets.getFullTextOCR(signedUrl, signedUrl);

    const raw_text = nanonets.getRawText(ocrResult);

    const chatCompletion = await openai.client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Please explain this text:

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
