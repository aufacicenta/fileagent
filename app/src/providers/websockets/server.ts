import WebSocket, { WebSocketServer } from "ws";

import {
  ComparingImagesStageProps,
  FetchingPromptStageProps,
  GettingOutputImgUrlStageProps,
  GettingSourceImgUrlStageProps,
  WebsocketBroadcastStage,
} from "./prompt-wars.types";

export const init = () => {
  const port = process.env.NEXT_PUBLIC_WEBSOCKETS_PORT as unknown as number;

  const wss = new WebSocketServer({ port });

  wss.on("listening", () => {
    console.log(`wss: listening at ${port}`);
  });

  wss.on("close", () => {
    console.log(`wss: closed ${port}`);
  });

  wss.on("connection", (ws) => {
    console.log(`wss: connected at ${port}`);

    ws.on("message", (message) => {
      console.log(message.toString());
    });

    const stages = [
      {
        stage: WebsocketBroadcastStage.GETTING_SOURCE_IMAGE_URL,
        stageDescription: "Getting source image URL",
        sourceImgURL:
          "https://blockchainassetregistry.infura-ipfs.io/ipfs/bafybeigb5am5yjzxep7hk55vcduatk5z5mceig5vrwqzzjmhxg65vigwbm/toast.jpg",
      } as GettingSourceImgUrlStageProps,
      {
        stage: WebsocketBroadcastStage.FETCHING_PROMPT,
        stageDescription: "Fetching prompt for account_id",
        prompt: "the prompt",
        negative_prompt: "the negative prompt",
      } as FetchingPromptStageProps,
      {
        stage: WebsocketBroadcastStage.GETTING_OUTPUT_IMG_URL,
        stageDescription: "Getting output image",
        outputImgURL:
          "https://blockchainassetregistry.infura-ipfs.io/ipfs/bafybeigb5am5yjzxep7hk55vcduatk5z5mceig5vrwqzzjmhxg65vigwbm/toast.jpg",
      } as GettingOutputImgUrlStageProps,
      {
        stage: WebsocketBroadcastStage.COMPARING_IMAGES,
        stageDescription: "Comparing images",
        percent: 0.5,
      } as ComparingImagesStageProps,
    ];

    const interval = setInterval(() => {
      if (stages.length === 0) {
        clearInterval(interval);

        return;
      }

      const stage = stages.shift();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(stage));
        }
      });
    }, 5000);
  });

  return wss;
};

export default { init };
