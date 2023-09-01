import clsx from "clsx";
import { Field, useForm } from "react-final-form";
import { useEffect, useLayoutEffect } from "react";

import { Card } from "ui/card/Card";
import { Button } from "ui/button/Button";
import { Dropzone } from "ui/dropzone/Dropzone";
import { useMessageContext } from "context/message/useMessageContext";
import { ChatContextMessage } from "context/message/MessageContext.types";
import { MessageFileType } from "ui/dropzone/message-file-type/MessageFileType";
import { MessageTextType } from "ui/dropzone/message-text-type/MessageTextType";
import { useFormContext } from "context/form/useFormContext";

import { DropboxChatProps, FieldNames } from "./DropboxChat.types";
import styles from "./DropboxChat.module.scss";

export const DropboxChat: React.FC<DropboxChatProps> = ({ className, onSubmit }) => {
  const form = useForm();
  const formContext = useFormContext();

  const { messages } = useMessageContext();

  useLayoutEffect(() => {
    if (!form) return;

    formContext.setForm(form);
  }, [form]);

  useEffect(() => {
    const element = document.querySelector(`#messages`);

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      await form.submit();
    }
  };

  const getMessageTypeComponent = (message: ChatContextMessage) => {
    switch (message.type) {
      case "text":
        return (
          <MessageTextType message={message} className={styles["dropbox-chat__messages--item"]} key={message.id} />
        );
      case "file":
        return (
          <MessageFileType message={message} className={styles["dropbox-chat__messages--item"]} key={message.id} />
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={onSubmit} className={clsx(styles["dropbox-chat"], className)}>
      <div className={styles["dropbox-chat__messages"]} id="messages">
        {messages.map((message) => getMessageTypeComponent(message))}
      </div>

      <div className={styles["dropbox-chat__textarea"]}>
        <Card className={styles["dropbox-chat__textarea--card"]} withSpotlightEffect>
          <Card.Content>
            <Field
              name={FieldNames.message}
              component="textarea"
              className={clsx(styles["dropbox-chat__textarea--card-field"], "input-field", "materialize-textarea")}
              id="prompt"
              onKeyDown={onKeyDown}
              placeholder="Type your message here..."
            />
          </Card.Content>
          <Card.Actions>
            <Dropzone />

            <Button type="submit">Send</Button>
          </Card.Actions>
        </Card>
      </div>
    </form>
  );
};
