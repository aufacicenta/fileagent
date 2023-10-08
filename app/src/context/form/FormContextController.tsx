import React, { useState } from "react";
import { setTimeout } from "timers";
import { sample } from "lodash";
import { APIChatHeaderKeyNames, CurrentMessageMetadata, FileAgentRequest } from "api/chat/types";
import { OAuthTokenStoreKey } from "api/oauth/oauth.types";

import { useMessageContext } from "context/message/useMessageContext";
import { ChatFormValues, FormFieldNames } from "app/chat/dropbox-chat/DropboxChat.types";
import { ChatContextMessage } from "context/message/MessageContext.types";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useAuthorizationContext } from "context/authorization/useAuthorizationContext";

import { FormContextControllerProps, FormContextType, FormState } from "./FormContext.types";
import { FormContext } from "./FormContext";

const defaultHeight = "63px";

const processingMessages = [
  "Processing...",
  "Please wait...",
  "Still on it...",
  "Hold on...",
  "Almost there...",
  "Huge file?",
  "Please be patient...",
];

const updateTextareaHeight = (id: string = "#message") => {
  const textarea = document.querySelector(id)! as HTMLTextAreaElement;

  textarea.style.height = defaultHeight;
  textarea.style.height = `${textarea.scrollHeight}px`;

  return { textarea, defaultHeight };
};

const resetTextareaHeight = (id: string = "#message") => {
  setTimeout(() => {
    const textarea = document.querySelector(id)! as HTMLTextAreaElement;

    textarea.style.height = defaultHeight;
  }, 100);
};

export const FormContextController = ({ children }: FormContextControllerProps) => {
  const [form, setForm] = useState<FormState | undefined>(undefined);
  const [currentMessageMetadata, setCurrentMessageMetadata] = useState<CurrentMessageMetadata>({});

  const messageContext = useMessageContext();

  const routes = useRoutes();

  const authContext = useAuthorizationContext();

  const setFieldValue = (field: string, text: string) => {
    form?.mutators.setValue(field, text);

    setTimeout(() => {
      updateTextareaHeight();

      form?.focus(field);
    }, 100);
  };

  const submit = async (values: ChatFormValues) => {
    if (!form) return;

    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: true }));

    const message: ChatContextMessage = { content: values.message, role: "user", type: "text" };

    messageContext.appendMessage(message);

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

      resetTextareaHeight();

      const messages = messageContext.getPlainMessages();

      const headers: Record<any, string> = {};

      if (authContext.accessTokens[OAuthTokenStoreKey.dropbox_esign]) {
        headers[APIChatHeaderKeyNames.x_dropbox_access_token] =
          authContext.accessTokens[OAuthTokenStoreKey.dropbox_esign]!;
      }

      if (authContext.accessTokens[OAuthTokenStoreKey.square_api]) {
        headers[APIChatHeaderKeyNames.x_square_access_token] = authContext.accessTokens[OAuthTokenStoreKey.square_api]!;
      }

      const options = {
        method: "POST",
        body: JSON.stringify({
          messages,
          currentMessage: messageContext.extractApiRequestValues(message),
          currentMessageMetadata,
        } as FileAgentRequest),
        headers,
      };

      const result = await (process.env.NEXT_PUBLIC_CHAT_AI_API === "openai"
        ? fetch(routes.api.chat.openai.completionsAPI(), options)
        : fetch(routes.api.chat.googleai.completionsAPI(), options));

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
        type: "readonly",
      });

      form.mutators.setValue(FormFieldNames.message, values.message);
    }

    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: false }));

    clearInterval(processingInterval);
  };

  const props: FormContextType = {
    setForm,
    setFieldValue,
    setCurrentMessageMetadata,
    updateTextareaHeight,
    resetTextareaHeight,
    submit,
  };

  return <FormContext.Provider value={props}>{children}</FormContext.Provider>;
};
