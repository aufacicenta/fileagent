import OpenAI from "openai";

import { extract_content_from_pdf_file_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import openai from "providers/openai";

import { NanonetsResults } from "./extract_content_from_pdf_file.types";

const extract_content_from_pdf_file = async (
  args: extract_content_from_pdf_file_args,
  choice: OpenAI.Chat.ChatCompletion.Choice,
): Promise<OpenAI.Chat.ChatCompletion.Choice> => {
  try {
    console.log("extract_content_from_pdf_file", args);

    const file =
      "https://blockchainassetregistry.infura-ipfs.io/ipfs/bafybeidxxuzx6ht6qz3chhxtmyo2dhya7ykes2mo7gqptpwphvnkzptx3y/DERECHOS-INSCRIPCION-35295_249_184_3_9_22-08-2023%2016.21.06.pdf.pdf";

    logger.info(`Getting nanonets full text of file ${file}`);

    const body = new URLSearchParams();

    body.append("urls", file);
    body.append("file", file);

    const key = Buffer.from(`${process.env.NANONETS_API_KEY}:`).toString("base64");
    const Authorization = `Basic ${key}`;

    const result = await fetch("https://app.nanonets.com/api/v2/OCR/FullText", {
      method: "POST",
      headers: {
        Authorization,
      },
      body,
    });

    const json: NanonetsResults = await result.json();

    const raw_text = json.results[0].page_data.map((data) => data.raw_text).join("\n");

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
