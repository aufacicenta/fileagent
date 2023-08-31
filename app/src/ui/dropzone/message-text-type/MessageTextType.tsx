import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useTypingSimulation } from "hooks/useTypingSimulation/useTypingSimulation";

import { MessageTextTypeProps } from "./MessageTextType.types";
import styles from "./MessageTextType.module.scss";

export const MessageTextType: React.FC<MessageTextTypeProps> = ({ message, className }) => {
  const isSimulationEnabled = message.role === "assistant";

  useTypingSimulation(message.content, isSimulationEnabled, `#${message.id}`);

  return (
    <div className={clsx(styles["message-text-type"], className)}>
      <div>
        <div className={styles["message-text-type__avatar"]}>
          <div className={styles["message-text-type__avatar-box"]}>
            <Icon name={message.role === "user" ? "icon-user" : "icon-brain"} />
          </div>
        </div>
        <div className={styles["message-text-type__content"]}>
          {!isSimulationEnabled ? (
            <Typography.Text>{message.content}</Typography.Text>
          ) : (
            <Typography.Text id={message.id} />
          )}
        </div>
      </div>
    </div>
  );
};
