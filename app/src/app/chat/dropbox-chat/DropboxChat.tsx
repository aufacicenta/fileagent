import clsx from "clsx";
import { Field, useForm } from "react-final-form";

import { Card } from "ui/card/Card";
import { Icon } from "ui/icon/Icon";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { Dropzone } from "ui/dropzone/Dropzone";

import { DropboxChatProps } from "./DropboxChat.types";
import styles from "./DropboxChat.module.scss";

export const DropboxChat: React.FC<DropboxChatProps> = ({ className, onSubmit, messages }) => {
  const form = useForm();

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      await form.submit();
    }
  };

  return (
    <form onSubmit={onSubmit} className={clsx(styles["dropbox-chat"], className)}>
      <div className={styles["dropbox-chat__messages"]}>
        {messages.map((message) => (
          <div className={styles["dropbox-chat__messages--item"]} key={message.content?.slice(0, 5).trim()}>
            <div>
              <div className={styles["dropbox-chat__messages--item-avatar"]}>
                <div className={styles["dropbox-chat__messages--item-avatar-box"]}>
                  <Icon name={message.role === "user" ? "icon-user" : "icon-brain"} />
                </div>
              </div>
              <div className={styles["dropbox-chat__messages--item-content"]}>
                <Typography.Text>{message.content}</Typography.Text>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles["dropbox-chat__textarea"]}>
        <Card className={styles["dropbox-chat__textarea--card"]} withSpotlightEffect>
          <Card.Content>
            <Field
              name="message"
              component="textarea"
              className={clsx(styles["dropbox-chat__textarea--card-field"], "input-field", "materialize-textarea")}
              id="prompt"
              onKeyDown={onKeyDown}
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
