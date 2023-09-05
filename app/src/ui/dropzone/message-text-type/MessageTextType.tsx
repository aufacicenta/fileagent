import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useTypingSimulation } from "hooks/useTypingSimulation/useTypingSimulation";
import { LoadingSpinner } from "ui/icons/LoadingSpinner";

import { MessageTextTypeProps } from "./MessageTextType.types";
import styles from "./MessageTextType.module.scss";

export const MessageTextType: React.FC<MessageTextTypeProps> = ({ message, className }) => {
  const isSimulationEnabled = message.role === "assistant" && !message.hasInnerHtml;

  const { simulationEnded } = useTypingSimulation(message.content, isSimulationEnabled, `#${message.id}`);

  return (
    <div className={clsx(styles["message-text-type"], className)}>
      <div>
        <div className={styles["message-text-type__avatar"]}>
          <div className={styles["message-text-type__avatar-box"]}>
            {message.type === "readonly" && !simulationEnded ? (
              <LoadingSpinner className={styles["message-text-type__loading-spinner"]} />
            ) : (
              <Icon name={message.role === "user" ? "icon-user" : "icon-brain"} />
            )}
          </div>
        </div>
        <div className={styles["message-text-type__content"]}>
          {message.beforeContentComponent && simulationEnded && message.beforeContentComponent}

          {!isSimulationEnabled ? (
            <Typography.Text dangerouslySetInnerHTML={{ __html: message.content! }} />
          ) : (
            <Typography.Text id={message.id} />
          )}

          {message.afterContentComponent && simulationEnded && message.afterContentComponent}
        </div>
      </div>
    </div>
  );
};
