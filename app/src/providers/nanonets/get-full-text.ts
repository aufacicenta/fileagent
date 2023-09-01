import logger from "providers/logger";

import { NanonetsResults } from "./nanonets.types";

const getFullTextOCR = async (fileURL: string, urls?: string) => {
  try {
    logger.info(`Getting nanonets full text of file ${urls}`);

    const body = new URLSearchParams();

    if (urls) {
      body.append("urls", urls);
    }

    body.append("file", fileURL);

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

    return json;
  } catch (error) {
    logger.error(error);

    throw error;
  }
};

export default getFullTextOCR;
