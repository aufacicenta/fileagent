import clsx from "clsx";
import Countdown from "react-countdown";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";

import { RevealProgressModalProps } from "./RevealProgressModal.types";
import styles from "./RevealProgressModal.module.scss";

// @TODO implement RevealProgressModal
// Should fetch a batch of outcome_id prompts revealing status via a websocket and display the comparison to the users
// labels: 500 USDT
export const RevealProgressModal: React.FC<RevealProgressModalProps> = ({
  onClose,
  className,
  marketContractValues,
  onRevealCountdownComplete,
}) => {
  const { resolution } = marketContractValues;

  return (
    <Modal
      className={clsx(styles["faqs-modal"], className)}
      isOpened
      aria-labelledby="Prompt Wars Reveal Progress Modal Window"
      onClose={onClose}
      fullscreenVariant="default"
    >
      <Modal.Header onClose={onClose}>
        <Typography.Headline2 flat>Reveal Progress</Typography.Headline2>
        <Typography.MiniDescription flat>
          <Countdown date={resolution.reveal_window} onComplete={onRevealCountdownComplete} />
        </Typography.MiniDescription>
      </Modal.Header>
      <Modal.Content />
    </Modal>
  );
};
