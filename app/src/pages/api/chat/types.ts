import { ChatContextMessage } from "context/message/MessageContext.types";

export type DropboxESignRequest = {
  messages: ChatContextMessage[];
  currentMessage: ChatContextMessage;
};
