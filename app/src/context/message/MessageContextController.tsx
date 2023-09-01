import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { MessageContext } from "./MessageContext";
import { ChatContextMessage, MessageContextControllerProps } from "./MessageContext.types";

const transformId = (id: string) => `x${id}`;

export const MessageContextController = ({ children }: MessageContextControllerProps) => {
  const [messages, setMessages] = useState<Array<ChatContextMessage>>([]);

  const extractApiRequestValues = (message: ChatContextMessage) => ({
    role: message.role,
    content: message.content,
  });

  const getPlainMessages = () => messages.map((message) => extractApiRequestValues(message));

  const appendMessage = (message: ChatContextMessage) => {
    setMessages((prev) => [...prev, { ...message, id: message.id ? transformId(message.id) : transformId(uuidv4()) }]);
  };

  const updateMessage = (message: ChatContextMessage) => {
    setMessages((prev) => {
      const i = prev.findIndex((item) => item.id === transformId(message.id!));

      return Object.assign([], { ...prev, [i]: { ...message, id: transformId(message.id!) } });
    });
  };

  const displayInitialMessage = () => {
    appendMessage({
      content: `Hello, I'm an intelligent File Agent. You can upload PDF files (more file types in the way) and I'll try to understand and do things with them if you ask me to.

        Try uploading your first file by dragging and dropping it in the box below or by clicking the box and selecting a file from your computer.`,
      role: "assistant",
      type: "text",
    });
  };

  const props = {
    messages,
    displayInitialMessage,
    appendMessage,
    updateMessage,
    getPlainMessages,
    extractApiRequestValues,
  };

  return <MessageContext.Provider value={props}>{children}</MessageContext.Provider>;
};
