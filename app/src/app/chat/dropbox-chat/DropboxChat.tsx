import clsx from "clsx";
import { Field, useForm } from "react-final-form";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Card } from "ui/card/Card";
import { Button } from "ui/button/Button";
import { useMessageContext } from "context/message/useMessageContext";
import { ChatContextMessage } from "context/message/MessageContext.types";
import { MessageFileType } from "ui/dropzone/message-file-type/MessageFileType";
import { MessageTextType } from "ui/dropzone/message-text-type/MessageTextType";
import { useFormContext } from "context/form/useFormContext";

import { DropboxChatProps, FormFieldNames } from "./DropboxChat.types";
import styles from "./DropboxChat.module.scss";

export const DropboxChat: React.FC<DropboxChatProps> = ({ className, onSubmit }) => {
  const form = useForm();

  const formContext = useFormContext();

  const router = useRouter();

  const { messages, actions, clearMessages, saveMessageThread } = useMessageContext();

  useEffect(() => {
    if (!form) return;

    formContext.setForm(form);
  }, [form]);

  useEffect(() => {
    if (!formContext.form) return;

    const fileName = router.query?.fileName;

    if (fileName) {
      formContext.setFieldValue(
        FormFieldNames.message,
        `Extra el contenido de "${fileName}" y responde: ¿cuántos artículos tiene la Constitución Política de Guatemala?`,
      );
    }
  }, [formContext.form]);

  useEffect(() => {
    const element = document.querySelector(`#messages`);

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const onKeyDown = async (event: KeyboardEvent) => {
    const { textarea, defaultHeight } = formContext.updateTextareaHeight();

    if (event.key === "Backspace" && !textarea.textContent) {
      event.preventDefault();

      textarea.style.height = defaultHeight;
    }

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

        <div className={styles["dropbox-chat__textarea"]}>
          <div className={styles["dropbox-chat__textarea--actions"]}>
            <Button variant="text" color="secondary" size="s" onClick={clearMessages}>
              Clear
            </Button>
            <Button variant="text" color="secondary" size="s" onClick={saveMessageThread}>
              Save this thread
            </Button>
          </div>
          <Card className={styles["dropbox-chat__textarea--card"]} shadow>
            <Card.Content className={styles["dropbox-chat__textarea--card-content"]}>
              <Field
                name={FormFieldNames.message}
                component="textarea"
                className={clsx(styles["dropbox-chat__textarea--card-field"], "input-field", "materialize-textarea")}
                id="message"
                onKeyDown={onKeyDown}
                placeholder="Type your message here..."
                disabled={actions.isProcessingRequest}
              />
              <div className={styles["dropbox-chat__textarea--card-actions-button"]}>
                <Button type="submit" disabled={actions.isProcessingRequest}>
                  Send
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </form>
  );
};
