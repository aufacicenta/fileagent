/* eslint-disable no-restricted-syntax */
import { FileAgentRequest } from "api/chat/types";

import { ChatPrompt, Prompt } from "./googleai.types";

const convertFileAgentRequestMessagesToValidPrompt = (
  data: FileAgentRequest,
  partialPrompt: Pick<ChatPrompt, "context" | "examples">,
): Prompt => {
  const messages = data.messages.map((message) => ({ author: message.role, content: message.content! }));

  messages.push({ author: data.currentMessage.role, content: data.currentMessage.content! });

  messages.reduce((acc, curr, index, arr) => {
    const prev = index > 0 && arr[index - 1];

    if (!prev) {
      return acc;
    }

    if (prev.author === "user" && curr.author === "user") {
      arr.splice(index, 0, { author: "assistant", content: "Continue the conversation..." });
    }

    return curr;
  }, messages[0]);

  return {
    ...partialPrompt,
    messages,
  } as ChatPrompt;
};

export default convertFileAgentRequestMessagesToValidPrompt;
