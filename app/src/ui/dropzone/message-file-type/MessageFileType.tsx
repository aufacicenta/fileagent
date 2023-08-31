import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { CircularProgress } from "ui/circular-progress/CircularProgress";
import { useSubscription } from "hooks/useSubscription/useSubscription";
import { Icon } from "ui/icon/Icon";
import { useTypingSimulation } from "hooks/useTypingSimulation/useTypingSimulation";

import { MessageFileTypeProps } from "./MessageFileType.types";
import styles from "./MessageFileType.module.scss";

export const MessageFileType: React.FC<MessageFileTypeProps> = ({ message, className }) => {
  const isSimulationEnabled = message.role === "assistant";

  useTypingSimulation(message.content, isSimulationEnabled, `#${message.id}`);

  const progress: number = useSubscription(0, message.file.progressObservable);

  return (
    <div className={clsx(styles["message-file-type"], className)}>
      <div>
        <div className={styles["message-file-type__avatar"]}>
          <div className={styles["message-file-type__avatar-box"]}>
            {progress === 100 ? (
              <Icon name="icon-file-check" />
            ) : (
              <CircularProgress color="#ffd74b" percentage={progress} fontSize="21px" />
            )}
          </div>
        </div>
        <div className={styles["message-file-type__content"]}>
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
