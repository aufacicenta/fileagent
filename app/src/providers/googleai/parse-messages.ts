import { FileAgentRequest } from "api/chat/types";

import { ChatPrompt, Prompt } from "./googleai.types";

const convertFileAgentRequestMessagesToValidPrompt = (
  data: FileAgentRequest,
  partialPrompt: Pick<ChatPrompt, "context" | "examples">,
): Prompt => {
  const messages = data.messages.map((message) => ({ author: message.role, content: message.content! }));

  if (messages.length && messages[messages.length - 1].author === "user" && data.currentMessage.role === "user") {
    messages.push({ author: "assistant", content: "Continue the conversation..." });
  }

  messages.push({ author: data.currentMessage.role, content: data.currentMessage.content! });

  return {
    ...partialPrompt,
    messages,
  } as ChatPrompt;
};

export default convertFileAgentRequestMessagesToValidPrompt;
