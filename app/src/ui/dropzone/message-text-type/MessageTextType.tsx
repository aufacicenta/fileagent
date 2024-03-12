import clsx from "clsx";
import { Marked, Renderer } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

import { Typography } from "ui/typography/Typography";
import { useTypingSimulation } from "hooks/useTypingSimulation/useTypingSimulation";
import { LoadingSpinner } from "ui/icons/LoadingSpinner";
import { Button } from "ui/button/Button";
import { useFormContext } from "context/form/useFormContext";
import { FormFieldNames } from "app/chat/dropbox-chat/DropboxChat.types";
import { DropboxESignLabel, SquareAPILabel } from "context/message/MessageContext.types";
import date from "providers/date";
import { SquareGetLocationsMetadata } from "providers/chat/functions/square/square.types";

import { MessageTextTypeProps } from "./MessageTextType.types";
import styles from "./MessageTextType.module.scss";

const renderer = new Renderer();
renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
renderer.code = (code, _infostring, _escaped) => `<pre><code class="hljs">${code}</code></pre>`;

const markedOptions = {
  breaks: true,
  renderer,
};

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";

      return hljs.highlight(code, { language }).value;
    },
  }),
  markedOptions,
);

export const MessageTextType: React.FC<MessageTextTypeProps> = ({ message, className }) => {
  const isSimulationEnabled = message.role === "assistant" && !message.hasInnerHtml;

  const { simulationEnded } = useTypingSimulation(message.content as string, isSimulationEnabled, `#${message.id}`);

  const formContext = useFormContext();

  const onClickEdit = () => {
    formContext.setFieldValue(FormFieldNames.message, message.content as string);
  };

  const onClickSearchSquareOrders = () => {
    formContext.setFieldValue(
      FormFieldNames.message,
      `Search my Square orders of ${date.now().format("MMMM YYYY")}, for location id: ${
        (message.metadata as SquareGetLocationsMetadata)?.locationIds
          ? (message.metadata as SquareGetLocationsMetadata)?.locationIds[0]
          : "LOCATION_ID"
      }

Tell me what's the most sold product:`,
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
        <div className={styles["message-text-type__role-text"]}>
          {message.readOnly && !simulationEnded ? (
            <Typography.Description
              flat
              className={clsx({
                [styles["message-text-type__role-text--user"]]: message.role === "user",
                [styles["message-text-type__role-text--assistant"]]: message.role === "assistant",
              })}
            >
              <LoadingSpinner className={styles["message-text-type__loading-spinner"]} /> Thinking
            </Typography.Description>
          ) : (
            <Typography.Description
              flat
              className={clsx({
                [styles["message-text-type__role-text--user"]]: message.role === "user",
                [styles["message-text-type__role-text--assistant"]]: message.role === "assistant",
              })}
            >
              {message.role === "user" ? "You" : "Assistant"}
            </Typography.Description>
          )}
        </div>
        <div className={styles["message-text-type__content"]}>
          {message.beforeContentComponent && simulationEnded && message.beforeContentComponent}

          {!isSimulationEnabled ? (
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: marked.parse(message.content as string, markedOptions) as string,
              }}
            />
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
