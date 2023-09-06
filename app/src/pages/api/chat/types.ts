import { ChatContextMessage } from "context/message/MessageContext.types";

export enum APIChatHeaderKeyNames {
  x_dropbox_access_token = "x-dropbox-access-token",
}

export type DropboxESignRequest = {
  messages: ChatContextMessage[];
  currentMessage: ChatContextMessage;
};
