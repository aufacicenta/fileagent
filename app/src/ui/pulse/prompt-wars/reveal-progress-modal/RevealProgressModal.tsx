import clsx from "clsx";
import Countdown from "react-countdown";
import { useEffect, useState } from "react";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import {
  ComparingImagesStageProps,
  FetchingPromptStageProps,
  GettingOutputImgUrlStageProps,
  GettingSourceImgUrlStageProps,
  PromptWarsWebsocketStages,
  WebsocketBroadcastStage,
} from "providers/websockets/prompt-wars.types";
import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";

import { RevealProgressModalProps } from "./RevealProgressModal.types";
import styles from "./RevealProgressModal.module.scss";

// @TODO implement RevealProgressModal
// Should fetch a batch of outcome_id prompts revealing status via a websocket and display the comparison to the users
// labels: 500 USDT
export const RevealProgressModal: React.FC<RevealProgressModalProps> = ({
  onClose,
  className,
  marketContractValues,
}) => {
  const [stageDescription, setStageDescription] = useState("Loading");
  const [gettingSourceImageStage, setGettingSourceImageStage] = useState<GettingSourceImgUrlStageProps | undefined>();
  const [gettingOutputImageStage, setGettingOutputImageStage] = useState<GettingOutputImgUrlStageProps | undefined>();
  const [fetchingPromptStage, setFetchingPromptStage] = useState<FetchingPromptStageProps | undefined>();
  const [comparingImagesStage, setComparingImagesStage] = useState<ComparingImagesStageProps | undefined>();

  const { resolution } = marketContractValues;

  useEffect(() => {
    const ws = new WebSocket(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:${
        process.env.NEXT_PUBLIC_WEBSOCKETS_PORT
      }`,
    );

    ws.addEventListener("message", (msg) => {
      console.log(msg.data, JSON.parse(msg.data));

      const data = JSON.parse(msg.data) as PromptWarsWebsocketStages;

      setStageDescription(data.stageDescription);

      switch (data.stage) {
        case WebsocketBroadcastStage.GETTING_SOURCE_IMAGE_URL:
          setGettingSourceImageStage(data);
          break;
        case WebsocketBroadcastStage.FETCHING_PROMPT:
          setFetchingPromptStage(data);
          break;
        case WebsocketBroadcastStage.GETTING_OUTPUT_IMG_URL:
          setGettingOutputImageStage(data);
          break;
        case WebsocketBroadcastStage.COMPARING_IMAGES:
          setComparingImagesStage(data);
          break;

        default:
          break;
      }
    });

    ws.addEventListener("open", () => {
      console.log("connected");
      ws.send("a client message");
    });

    ws.addEventListener("error", (err) => {
      console.log(err);
    });
  }, []);

  return (
    <Modal
      className={clsx(styles["reveal-progress-modal"], className)}
      isOpened
      aria-labelledby="Prompt Wars Reveal Progress Modal Window"
      onClose={onClose}
      fullscreenVariant="default"
    >
      <Modal.Header onClose={onClose}>
        <Typography.Headline2 flat>Reveal Progress: {stageDescription}</Typography.Headline2>
        <Typography.MiniDescription flat>
          <Countdown date={resolution.reveal_window} />
        </Typography.MiniDescription>
      </Modal.Header>
      <Modal.Content>
        <Grid.Row>
          <Grid.Col lg={6} className={styles["reveal-progress-modal__img-col"]}>
            <Card>
              <Card.Content className={styles["reveal-progress-modal__img-col--content"]}>
                <img src={gettingSourceImageStage?.sourceImgURL || "/shared/loading-spinner.gif"} alt="source" />
              </Card.Content>
            </Card>
          </Grid.Col>
          <Grid.Col lg={6} className={styles["reveal-progress-modal__img-col"]}>
            <Card>
              <Card.Content className={styles["reveal-progress-modal__img-col--content"]}>
                <img src={gettingOutputImageStage?.outputImgURL || "/shared/loading-spinner.gif"} alt="output" />
              </Card.Content>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Modal.Content>
      <Modal.Actions className={styles["reveal-progress-modal__modal-actions"]}>
        <Grid.Row className={styles["reveal-progress-modal__modal-actions--row"]}>
          <Grid.Col lg={5}>
            <Typography.Description>Prompt</Typography.Description>
            <Typography.Text flat>{fetchingPromptStage?.prompt || "Loading"}</Typography.Text>
          </Grid.Col>
          <Grid.Col lg={5}>
            <Typography.Description>Negative Prompt</Typography.Description>
            <Typography.Text flat>{fetchingPromptStage?.negative_prompt || "Loading"}</Typography.Text>
          </Grid.Col>
          <Grid.Col lg={2}>
            <Typography.Description>Result</Typography.Description>
            <Typography.Headline2 flat>{comparingImagesStage?.percent || "Loading"}</Typography.Headline2>
          </Grid.Col>
        </Grid.Row>
      </Modal.Actions>
    </Modal>
  );
};
