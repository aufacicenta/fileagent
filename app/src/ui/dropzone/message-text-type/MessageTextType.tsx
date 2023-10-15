import clsx from "clsx";
import { marked } from "marked";

import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useTypingSimulation } from "hooks/useTypingSimulation/useTypingSimulation";
import { LoadingSpinner } from "ui/icons/LoadingSpinner";
import { Button } from "ui/button/Button";
import { useFormContext } from "context/form/useFormContext";
import { FormFieldNames } from "app/chat/dropbox-chat/DropboxChat.types";
import { DropboxESignLabel, SquareAPILabel } from "context/message/MessageContext.types";
import date from "providers/date";

import { MessageTextTypeProps } from "./MessageTextType.types";
import styles from "./MessageTextType.module.scss";

export const MessageTextType: React.FC<MessageTextTypeProps> = ({ message, className }) => {
  const isSimulationEnabled = message.role === "assistant" && !message.hasInnerHtml;

  const { simulationEnded } = useTypingSimulation(message.content, isSimulationEnabled, `#${message.id}`);

  const formContext = useFormContext();

  const onClickEdit = () => {
    formContext.setFieldValue(FormFieldNames.message, message.content!);
  };

  const onClickSearchSquareOrders = () => {
    formContext.setFieldValue(
      FormFieldNames.message,
      `Get my Square orders of ${date.now().format("MMMM YYYY")}, for location id: ${
        message.metadata?.locationIds ? message.metadata?.locationIds[0] : "LOCATION_ID"
      }`,
    );
  };

  const getOptionComponentsByLabel = () => {
    if (!message.label) return null;

    switch (message.label) {
      case DropboxESignLabel.dropbox_esign_request_success:
        return (
          <div className={styles["message-text-type__options"]}>
            <Button variant="outlined" color="secondary" size="s">
              List my signature requests
            </Button>
            <Button variant="outlined" color="secondary" size="s">
              Send a reminder
            </Button>
          </div>
        );
      case SquareAPILabel.square_get_locations_request_success:
        return (
          <div className={styles["message-text-type__options"]}>
            <Button variant="outlined" color="secondary" size="s" onClick={onClickSearchSquareOrders}>
              Get my Square orders
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={clsx(styles["message-text-type"], className)}>
      <div>
        <div className={styles["message-text-type__avatar"]}>
          <div className={styles["message-text-type__avatar-box"]}>
            {message.readOnly && !simulationEnded ? (
              <LoadingSpinner className={styles["message-text-type__loading-spinner"]} />
            ) : (
              <Icon name={message.role === "user" ? "icon-user" : "icon-brain"} />
            )}
          </div>
        </div>
        <div className={styles["message-text-type__content"]}>
          {message.beforeContentComponent && simulationEnded && message.beforeContentComponent}

          {!isSimulationEnabled ? (
            <Typography.Text dangerouslySetInnerHTML={{ __html: marked.parse(message.content!) }} />
          ) : (
            <Typography.Text id={message.id} />
          )}

          {message.role === "user" && (
            <div className={styles["message-text-type__static-options"]}>
              <Button variant="text" size="xs" color="secondary" onClick={onClickEdit}>
                Edit
              </Button>
            </div>
          )}

          {message.role === "assistant" && getOptionComponentsByLabel()}

          {message.afterContentComponent && simulationEnded && message.afterContentComponent}
        </div>
      </div>
    </div>
  );
};
