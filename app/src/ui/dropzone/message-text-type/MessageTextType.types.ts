import { ReactNode } from "react";

import { ChatContextMessage } from "context/message/MessageContext.types";

export type MessageTextTypeProps = {
  message: ChatContextMessage;
  children?: ReactNode;
  className?: string;
};
