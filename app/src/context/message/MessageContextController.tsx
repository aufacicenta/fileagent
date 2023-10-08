import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";
import { MessageFileType } from "ui/dropzone/message-file-type/MessageFileType";
import { FormFieldNames } from "app/chat/dropbox-chat/DropboxChat.types";
import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";
import { useChatSidebarContext } from "context/chat-sidebar/useChatSidebarContext";
import { LocalStorageKeys } from "hooks/useLocalStorage/useLocalStorage.types";

import { MessageContext } from "./MessageContext";
import {
  ChatContextMessage,
  MessageContextActions,
  MessageContextControllerProps,
  MessageContextType,
} from "./MessageContext.types";

const transformId = (id: string) => `x${id}`;

export const MessageContextController = ({ children }: MessageContextControllerProps) => {
  const [messages, setMessages] = useState<Array<ChatContextMessage>>([]);
  const [actions, setActions] = useState<MessageContextActions>({
    isProcessingRequest: false,
  });

  const ls = useLocalStorage();

  const chatSidebarContext = useChatSidebarContext();

  const extractApiRequestValues = (message: ChatContextMessage) => ({
    role: message.role,
    content: message.content,
  });

  const extractLocalStorageValues = (message: ChatContextMessage) => {
    const val = {
      id: message.id,
      role: message.role,
      content: message.content,
      type: message.type,
      hasInnerHtml: message.hasInnerHtml,
      label: message.label,
    };

    if (message.type === "file") {
      (val as any).file = {
        name: message.file.name,
      } as Pick<DropzoneFileExtended, "name">;
    }

    return val;
  };

  const getPlainMessages = () =>
    messages
      .map((message) => {
        if (message.type === "readonly") {
          return null;
        }

        return extractApiRequestValues(message);
      })
      .filter(Boolean) as ChatContextMessage[];

  const getLocalStorageMessages = (value: ChatContextMessage[]) =>
    value
      .map((message) => {
        if (message.type === "readonly") {
          return null;
        }

        return extractLocalStorageValues(message);
      })
      .filter(Boolean) as ChatContextMessage[];

  const appendMessage = (message: ChatContextMessage) => {
    const id = message.id ? transformId(message.id) : transformId(uuidv4());

    const msg = { ...message, id };

    setMessages((prev) => {
      const val = [...prev, msg];

      ls.set(LocalStorageKeys.messages, getLocalStorageMessages(val));

      return val;
    });

    return msg;
  };

  const deleteMessage = (id: ChatContextMessage["id"]) => {
    setMessages((prev) => {
      const i = prev.findIndex((item) => item.id === id!);

      const $prev = prev;

      $prev.splice(i, 1);

      const val = Object.assign([], { ...$prev });

      ls.set(LocalStorageKeys.messages, getLocalStorageMessages(val));

      return val;
    });
  };

  const updateMessage = (message: ChatContextMessage) => {
    setMessages((prev) => {
      const i = prev.findIndex((item) => item.id === message.id!);

      const val = Object.assign([], { ...prev, [i]: { ...message, id: message.id! } });

      ls.set(LocalStorageKeys.messages, getLocalStorageMessages(val));

      return val;
    });

    return message;
  };

  const clearMessages = () => {
    setMessages([]);

    ls.set(LocalStorageKeys.messages, []);

    appendMessage({
      content: `Chat history cleared!`,
      role: "assistant",
      type: "readonly",
    });
  };

  const saveMessageThread = () => {
    try {
      const threads = ls.get<ChatContextMessage[][]>(LocalStorageKeys.threads) || [];

      threads?.push(messages);

      ls.set(LocalStorageKeys.threads, threads);

      chatSidebarContext.open();

      appendMessage({
        content: `Thread saved!`,
        role: "assistant",
        type: "readonly",
      });
    } catch {
      appendMessage({
        content: `I couldn't save the thread. Please, try again.`,
        role: "assistant",
        type: "readonly",
      });
    }
  };

  const loadMessageThread = (index: number) => {
    try {
      setMessages([]);

      const threads = ls.get<ChatContextMessage[][]>(LocalStorageKeys.threads) || [];

      const lsMessages = threads[index];

      ls.set(LocalStorageKeys.messages, lsMessages);

      lsMessages.forEach((message) => {
        appendMessage({
          ...message,
          id: undefined,
          type: message.type === "file" ? "text" : message.type,
          afterContentComponent:
            message.type === "file" ? (
              <MessageFileType.Options
                file={{ name: message.file.name } as DropzoneFileExtended}
                fieldName={FormFieldNames.message}
              />
            ) : undefined,
        });
      });

      chatSidebarContext.close();
    } catch {
      appendMessage({
        content: `I couldn't load the thread. Please, try again.`,
        role: "assistant",
        type: "readonly",
      });
    }
  };

  const displayInitialMessage = () => {
    const lsMessages = ls.get<ChatContextMessage[]>(LocalStorageKeys.messages);

    if (lsMessages && lsMessages?.length > 0) {
      ls.set(LocalStorageKeys.messages, []);

      appendMessage({
        content: `Welcome back!`,
        role: "assistant",
        type: "readonly",
      });

      lsMessages.forEach((message) => {
        appendMessage({
          ...message,
          id: undefined,
          type: message.type === "file" ? "text" : message.type,
          afterContentComponent:
            message.type === "file" ? (
              <MessageFileType.Options
                file={{ name: message.file.name } as DropzoneFileExtended}
                fieldName={FormFieldNames.message}
              />
            ) : undefined,
        });
      });

      return;
    }

    appendMessage({
      content: `Hello, I'm an intelligent File Agent. You can upload PDF files (more file types in the way) and I'll try to understand and do things with them if you ask me to.

        Try uploading your first file by dragging and dropping it in the box below or by clicking the box and selecting a file from your computer.`,
      role: "assistant",
      type: "readonly",
    });
  };

  const props: MessageContextType = {
    messages,
    displayInitialMessage,
    clearMessages,
    saveMessageThread,
    loadMessageThread,
    appendMessage,
    updateMessage,
    deleteMessage,
    getPlainMessages,
    extractApiRequestValues,
    setActions,
    actions,
    transformId,
  };

  return <MessageContext.Provider value={props}>{children}</MessageContext.Provider>;
};
