import { Form as RFForm } from "react-final-form";
import { FormApi } from "final-form";
import { useEffect } from "react";
import { DropboxESignRequest } from "api/chat/types";
import { sample } from "lodash";

import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useMessageContext } from "context/message/useMessageContext";
import { ChatContextMessage } from "context/message/MessageContext.types";
import { useFormContext } from "context/form/useFormContext";
import { useAuthorizationContext } from "context/authorization/useAuthorizationContext";

import { DropboxChat } from "./DropboxChat";
import { ChatFormValues, FieldNames } from "./DropboxChat.types";

export const DropboxChatContainer = () => {
  const routes = useRoutes();

  const messageContext = useMessageContext();

  const formContext = useFormContext();

  const authContext = useAuthorizationContext();

  useEffect(() => {
    messageContext.displayInitialMessage();
  }, []);

  useEffect(() => {
    authContext.verifyDropboxESignAuthorization();
  }, []);

  const onSubmit = async (values: ChatFormValues, form: FormApi<ChatFormValues>) => {
    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: true }));

    const message: ChatContextMessage = { content: values.message, role: "user", type: "text" };

    messageContext.appendMessage(message);

    const processingMessages = [
      "Processing...",
      "Please wait...",
      "Still on it...",
      "Hold on...",
      "Almost there...",
      "Huge file?",
      "Please be patient...",
    ];

    const loadingMessage = messageContext.appendMessage({
      type: "readonly",
      content: processingMessages[0],
      role: "assistant",
    });

    const processingInterval = setInterval(() => {
      const content = sample(processingMessages)!;

      messageContext.updateMessage({
        ...loadingMessage,
        content,
      });
    }, 10000);

    try {
      form.reset();

      formContext.resetTextareaHeight();

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

      messageContext.deleteMessage(loadingMessage.id!);

      if (json.error) {
        throw new Error(json.error);
      }

      messageContext.appendMessage({ ...json.choices[0].message });
    } catch (error) {
      console.log(error);

      messageContext.deleteMessage(loadingMessage.id!);

      messageContext.appendMessage({
        content: `Apologies, I wasn't able to complete your request.

        - Maybe the file is too large?
        - The content may be unreadable
        - Check your internet connection`,
        role: "assistant",
        type: "text",
      });

      form.mutators.setValue(FieldNames.message, values.message);
    }

    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: false }));

    clearInterval(processingInterval);
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
