import { ReactNode } from "react";

import { ReadOnlyChatCompletionMessage, TextChatCompletionMessage } from "context/message/MessageContext.types";

export type MessageTextTypeProps = {
  message: TextChatCompletionMessage | ReadOnlyChatCompletionMessage;
  children?: ReactNode;
  className?: string;
};
