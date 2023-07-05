export enum WebsocketBroadcastStage {
  LOADING = "LOADING",
  GETTING_SOURCE_IMAGE_URL = "GETTING_SOURCE_IMAGE_URL",
  FETCHING_PROMPT = "FETCHING_PROMPT",
  GETTING_OUTPUT_IMG_URL = "GETTING_OUTPUT_IMG_URL",
  COMPARING_IMAGES = "COMPARING_IMAGES",
}

type BaseProps = {
  stageDescription: string;
};

export type LoadingStageProps = {
  stage: WebsocketBroadcastStage.LOADING;
} & BaseProps;

export type GettingSourceImgUrlStageProps = {
  stage: WebsocketBroadcastStage.GETTING_SOURCE_IMAGE_URL;
  sourceImgURL?: string;
} & BaseProps;

export type FetchingPromptStageProps = {
  stage: WebsocketBroadcastStage.FETCHING_PROMPT;
  prompt?: string;
  negative_prompt?: string;
} & BaseProps;

export type GettingOutputImgUrlStageProps = {
  stage: WebsocketBroadcastStage.GETTING_OUTPUT_IMG_URL;
  outputImgURL?: string;
} & BaseProps;

export type ComparingImagesStageProps = {
  stage: WebsocketBroadcastStage.COMPARING_IMAGES;
  percent?: number;
} & BaseProps;

export type PromptWarsWebsocketStages =
  | LoadingStageProps
  | GettingSourceImgUrlStageProps
  | FetchingPromptStageProps
  | GettingOutputImgUrlStageProps
  | ComparingImagesStageProps;
