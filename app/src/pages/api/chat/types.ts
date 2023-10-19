import { ChatContextMessage } from "context/message/MessageContext.types";
import { ChatCompletionChoice } from "providers/chat/chat.types";

export enum APIChatHeaderKeyNames {
  x_dropbox_access_token = "x-dropbox-access-token",
  x_square_access_token = "x-square-access-token",

  // [fileName].tsx path
  x_public_bucket_name = "x_public_bucket_name",
}

export type CurrentMessageMetadata = {
  bucketName?: string;
};

export type FileAgentRequest = {
  messages: ChatContextMessage[];
  currentMessage: ChatContextMessage;
  currentMessageMetadata?: CurrentMessageMetadata;
};

export type FileAgentResponse = {
  choices: ChatCompletionChoice[];
};
