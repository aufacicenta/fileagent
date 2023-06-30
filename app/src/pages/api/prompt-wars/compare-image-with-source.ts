import Replicate from "replicate";
import WebSocket from "ws";
import { NextApiRequest, NextApiResponse } from "next";
import Jimp from "jimp";

import logger from "providers/logger";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";
import { PromptWarsMarketContract } from "providers/near/contracts/prompt-wars/contract";
import ipfs from "providers/ipfs";
import websockets from "providers/websockets";
import {
  ComparingImagesStageProps,
  FetchingPromptStageProps,
  GettingOutputImgUrlStageProps,
  GettingSourceImgUrlStageProps,
  WebsocketBroadcastStage,
} from "providers/websockets/prompt-wars.types";

const DEFAULT_IMG_DIMENSIONS = { width: 512, height: 512 };

export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  const wss = websockets.server.init();

  try {
    // @TODO authenticate the request, only this server should be able to execute this endpoint
    // labels: 100 USDT
    const marketFactory = await MarketFactoryContract.loadFromGuestConnection();
    const marketsList = await marketFactory.get_markets_list();

    if (!marketsList) {
      throw new Error("ERR_FAILED_TO_FETCH_MARKETS");
    }

    // Should be the latest active market, still within the reveal and resolution window
    const marketId = marketsList.pop();

    const market = await PromptWarsMarketContract.loadFromGuestConnection(marketId!);

    const [is_reveal_window_expired, is_over] = await Promise.all([
      market.is_reveal_window_expired(),
      market.is_over(),
    ]);

    if (!is_over || is_reveal_window_expired) {
      throw new Error("ERR_MARKET_CANNOT_BE_REVEALED");
    }

    const { image_uri } = await market.get_market_data();
    const sourceImgURL = ipfs.asHttpsURL(image_uri);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            stage: WebsocketBroadcastStage.GETTING_SOURCE_IMAGE_URL,
            stageDescription: "Getting source image URL",
            sourceImgURL,
          } as GettingSourceImgUrlStageProps),
        );
      }
    });

    logger.info({ marketId, image_uri });

    const sourceImg = await Jimp.read(sourceImgURL);

    const outcomeIds = await market.get_outcome_ids();

    const model = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
    const image_dimensions = `${DEFAULT_IMG_DIMENSIONS.width}x${DEFAULT_IMG_DIMENSIONS.height}`;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    await Promise.all(
      outcomeIds.map(async (outcome_id) => {
        const outcomeToken = await market.get_outcome_token({ outcome_id });
        const { prompt } = outcomeToken;

        const { value, negative_prompt } = JSON.parse(prompt);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                stage: WebsocketBroadcastStage.FETCHING_PROMPT,
                stageDescription: `Fetching prompt from ${outcome_id}`,
                prompt: value,
                negative_prompt,
              } as FetchingPromptStageProps),
            );
          }
        });

        logger.info({ value, negative_prompt });

        const input = {
          prompt: value,
          negative_prompt,
          image_dimensions,
        };

        logger.info({ input });

        const [outputImgURL] = (await replicate.run(model, { input })) as Array<string>;

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                stage: WebsocketBroadcastStage.GETTING_OUTPUT_IMG_URL,
                stageDescription: "Getting the output image",
                outputImgURL,
              } as GettingOutputImgUrlStageProps),
            );
          }
        });

        logger.info({ outputImgURL });

        const destImg = await Jimp.read(outputImgURL);

        const { percent } = Jimp.diff(sourceImg, destImg);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                stage: WebsocketBroadcastStage.COMPARING_IMAGES,
                stageDescription: "Comparing images",
                percent,
              } as ComparingImagesStageProps),
            );
          }
        });

        logger.info({ percent });

        await PromptWarsMarketContract.reveal(marketId!, outcome_id, percent);
      }),
    );

    response.status(200).json({ outcomeIds });
  } catch (error) {
    logger.error(error);

    response.status(500).json({ error: (error as Error).message });
  }

  wss?.close();
}
