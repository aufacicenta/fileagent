import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { CircularProgress } from "ui/circular-progress/CircularProgress";
import { useSubscription } from "hooks/useSubscription/useSubscription";
import { Icon } from "ui/icon/Icon";
import { useTypingSimulation } from "hooks/useTypingSimulation/useTypingSimulation";
import { Button } from "ui/button/Button";

import { MessageFileTypeProps } from "./MessageFileType.types";
import styles from "./MessageFileType.module.scss";

export const MessageFileType = ({ message, className }: MessageFileTypeProps) => {
  const isSimulationEnabled = message.role === "assistant";

  const { simulationEnded } = useTypingSimulation(message.content, isSimulationEnabled, `#${message.id}`);

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
          {message.beforeContentComponent && simulationEnded && message.beforeContentComponent}

          {!isSimulationEnabled ? (
            <Typography.Text>{message.content}</Typography.Text>
          ) : (
            <Typography.Text id={message.id} />
          )}

          {message.afterContentComponent && simulationEnded && message.afterContentComponent}
        </div>
      </div>
    </div>
  );
};

const Options = () => (
  <div className={styles["message-file-type__options"]}>
    <Button color="secondary" variant="outlined" size="s">
      Download
    </Button>
    <Button color="secondary" variant="outlined" size="s">
      Extract content
    </Button>
    <Button color="secondary" variant="outlined" size="s">
      Send
    </Button>
    <Button color="secondary" variant="outlined" size="s">
      Get file details
    </Button>
    <Button color="danger" variant="outlined" size="s">
      Delete
    </Button>
  </div>
);

MessageFileType.Options = Options;
