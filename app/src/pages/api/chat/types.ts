import { ChatContextMessage } from "context/message/MessageContext.types";

export enum APIChatHeaderKeyNames {
  x_dropbox_access_token = "x-dropbox-access-token",
  x_square_access_token = "x-square-access-token",
}

export type CurrentMessageMetadata = {
  bucketName?: string;
};

export type FileAgentRequest = {
  messages: ChatContextMessage[];
  currentMessage: ChatContextMessage;
  currentMessageMetadata?: CurrentMessageMetadata;
};
