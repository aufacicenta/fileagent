import { Form as RFForm } from "react-final-form";
import { FormApi } from "final-form";
import { useEffect } from "react";
import { DropboxESignRequest } from "api/chat/types";

import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useMessageContext } from "context/message/useMessageContext";
import { ChatContextMessage } from "context/message/MessageContext.types";

import { DropboxChat } from "./DropboxChat";
import { ChatFormValues } from "./DropboxChat.types";

export const DropboxChatContainer = () => {
  const routes = useRoutes();

  const messageContext = useMessageContext();

  useEffect(() => {
    messageContext.displayInitialMessage();
  }, []);

  const onSubmit = async (values: ChatFormValues, form: FormApi<ChatFormValues>) => {
    try {
      const message: ChatContextMessage = { content: values.message, role: "user", type: "text" };

      messageContext.appendMessage(message);

      const messages = messageContext.getPlainMessages();

      const result = await fetch(routes.api.chat.dropboxESign(), {
        method: "POST",
        body: JSON.stringify({
          messages,
          currentMessage: messageContext.extractApiRequestValues(message),
        } as DropboxESignRequest),
      });

      const json = await result.json();

      console.log(json);

      if (json.error) {
        throw new Error(json.error);
      }

      messageContext.appendMessage({ content: json.choices[0].message.content, role: "assistant", type: "text" });

      form.reset();
    } catch (error) {
      console.log(error);

      messageContext.appendMessage({
        content: "Apologies, I wasn't able to complete your request.",
        role: "assistant",
        type: "text",
      });
    }
  };

  return (
    <RFForm
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        },
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit }) => <DropboxChat onSubmit={handleSubmit} />}
    />
  );
};
