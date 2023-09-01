import { ChatCompletionMessage } from "openai/resources/chat";
import { ReactNode } from "react";

import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";

export type ChatMessageBase = ChatCompletionMessage & {
  id?: string;
  beforeContentComponent?: ReactNode;
  afterContentComponent?: ReactNode;
};

export type TextChatCompletionMessage = {
  type: "text";
} & ChatMessageBase;

export type FileChatCompletionMessage = {
  type: "file";
  file: DropzoneFileExtended;
} & ChatMessageBase;

export type ChatContextMessage = FileChatCompletionMessage | TextChatCompletionMessage;

export type MessageContextControllerProps = {
  children: ReactNode;
};

export type MessageContextType = {
  messages: Array<ChatContextMessage>;
  displayInitialMessage: () => void;
  appendMessage: (message: ChatContextMessage) => void;
  updateMessage: (message: ChatContextMessage) => void;
  getPlainMessages: () => Array<Pick<ChatContextMessage, "role" | "content">>;
  extractApiRequestValues: (message: ChatContextMessage) => Pick<ChatContextMessage, "role" | "content">;
};
