import { ReactNode } from "react";

import { FileChatCompletionMessage } from "context/message/MessageContext.types";

export type MessageFileTypeProps = {
  message: FileChatCompletionMessage;
  children?: ReactNode;
  className?: string;
};
