import { Form as RFForm } from "react-final-form";
import { useState } from "react";
import { FormApi } from "final-form";
import { ChatCompletionMessage } from "openai/resources/chat";

import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";

import { DropboxChat } from "./DropboxChat";
import { ChatFormValues } from "./DropboxChat.types";

export const DropboxChatContainer = () => {
  const [messages, setMessages] = useState<Array<ChatCompletionMessage>>([]);

  const routes = useRoutes();

  const toast = useToastContext();

  const onSubmit = async (values: ChatFormValues, form: FormApi<ChatFormValues>) => {
    try {
      setMessages((prev) => [...prev, { content: values.message, role: "user" }]);

      const result = await fetch(routes.api.chat.dropboxESign(), {
        method: "POST",
        body: JSON.stringify(values),
      });

      const json = await result.json();

      console.log(json);

      if (json.error) {
        throw new Error(json.error);
      }

      setMessages((prev) => [...prev, json.choices[0].message]);

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

  return (
    <RFForm
      onSubmit={onSubmit}
      render={({ handleSubmit }) => <DropboxChat onSubmit={handleSubmit} messages={messages} />}
    />
  );
};
