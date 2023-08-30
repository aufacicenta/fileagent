import clsx from "clsx";
import { Field, Form as RFForm } from "react-final-form";
import { useEffect } from "react";

import { Card } from "ui/card/Card";
import { Icon } from "ui/icon/Icon";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";

import { DropboxChatProps } from "./DropboxChat.types";
import styles from "./DropboxChat.module.scss";

const data = [
  {
    id: 1,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam ac tincidunt facilisis, nunc",
  },
  {
    id: 2,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam ac tincidunt facilisis, nunc",
  },
  {
    id: 3,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam ac tincidunt facilisis, nunc",
  },
  {
    id: 4,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam ac tincidunt facilisis, nunc",
  },
  {
    id: 5,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam ac tincidunt facilisis, nunc",
  },
  {
    id: 6,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam ac tincidunt facilisis, nunc",
  },
];

const onSubmit = () => undefined;

export const DropboxChat: React.FC<DropboxChatProps> = ({ className }) => {
  useEffect(() => undefined, []);

  return (
    <RFForm
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={clsx(styles["dropbox-chat"], className)}>
          <div className={styles["dropbox-chat__messages"]}>
            {data.map((item) => (
              <div className={styles["dropbox-chat__messages--item"]} key={item.id}>
                <div>
                  <div className={styles["dropbox-chat__messages--item-avatar"]}>
                    <div className={styles["dropbox-chat__messages--item-avatar-box"]}>
                      <Icon name="icon-user" />
                    </div>
                  </div>
                  <div className={styles["dropbox-chat__messages--item-content"]}>
                    <Typography.Text>{item.message}</Typography.Text>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles["dropbox-chat__textarea"]}>
            <Card className={styles["dropbox-chat__textarea--card"]} withSpotlightEffect>
              <Card.Content>
                <Field
                  name="prompt"
                  component="textarea"
                  className={clsx(styles["dropbox-chat__textarea--card-field"], "input-field", "materialize-textarea")}
                />
              </Card.Content>
              <Card.Actions>
                <Button type="submit">Send</Button>
              </Card.Actions>
            </Card>
          </div>
        </form>
      )}
    />
  );
};
