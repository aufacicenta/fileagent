import { Form as RFForm } from "react-final-form";
import { FormApi } from "final-form";
import { useEffect } from "react";

import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { useMessageContext } from "context/message/useMessageContext";

import { DropboxChat } from "./DropboxChat";
import { ChatFormValues } from "./DropboxChat.types";

export const DropboxChatContainer = () => {
  const routes = useRoutes();

  const toast = useToastContext();

  const messageContext = useMessageContext();

  useEffect(() => {
    messageContext.displayInitialMessage();
  }, []);

  const onSubmit = async (values: ChatFormValues, form: FormApi<ChatFormValues>) => {
    try {
      messageContext.appendMessage({ content: values.message, role: "user", type: "text" });

      const result = await fetch(routes.api.chat.dropboxESign(), {
        method: "POST",
        body: JSON.stringify(values),
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

      toast.trigger({
        variant: "error",
        title: "Message not sent",
        children: <Typography.Text>Check your internet connection and try again.</Typography.Text>,
      });
    }
  };

  return <RFForm onSubmit={onSubmit} render={({ handleSubmit }) => <DropboxChat onSubmit={handleSubmit} />} />;
};
