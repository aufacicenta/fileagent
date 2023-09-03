import clsx from "clsx";
import { Field, useForm } from "react-final-form";
import { useEffect } from "react";

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

  useEffect(() => {
    if (!form) return;

    formContext.setForm(form);
  }, [form]);

  useEffect(() => {
    const element = document.querySelector(`#messages`);

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const onKeyDown = async (event: KeyboardEvent) => {
    const textarea = document.querySelector(`#message`)! as HTMLTextAreaElement;

    const defaultHeight = "63px";

    textarea.style.height = defaultHeight;
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      await form.submit();

      textarea.style.height = defaultHeight;
    }
  };

  const getMessageTypeComponent = (message: ChatContextMessage) => {
    switch (message.type) {
      case "text":
        return (
          <MessageTextType message={message} className={styles["dropbox-chat__messages--item"]} key={message.id} />
        );
      case "readonly":
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
        <Card className={styles["dropbox-chat__textarea--card"]} shadow>
          <Card.Content>
            <Field
              name={FieldNames.message}
              component="textarea"
              className={clsx(styles["dropbox-chat__textarea--card-field"], "input-field", "materialize-textarea")}
              id="message"
              onKeyDown={onKeyDown}
              placeholder="Type your message here..."
            />
          </Card.Content>
          <Card.Actions className={styles["dropbox-chat__textarea--card-actions"]}>
            <Dropzone />

            <div className={styles["dropbox-chat__textarea--card-actions-button"]}>
              <Button type="submit">Send</Button>
            </div>
          </Card.Actions>
        </Card>
      </div>
    </form>
  );
};
