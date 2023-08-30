import { ChatCompletionMessage } from "openai/resources/chat";
import { ReactNode } from "react";

export type ChatFormValues = {
  message: string;
};

export type DropboxChatContainerProps = {
  children?: ReactNode;
  className?: string;
};

export type DropboxChatProps = {
  onSubmit: (event?: Partial<Pick<React.SyntheticEvent, "preventDefault" | "stopPropagation">>) =>
    | Promise<
        | {
            [key: string]: any;
          }
        | undefined
      >
    | undefined;
  messages: Array<ChatCompletionMessage>;
  children?: ReactNode;
  className?: string;
};
