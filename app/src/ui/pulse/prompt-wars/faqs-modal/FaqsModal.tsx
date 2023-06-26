import clsx from "clsx";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";

import { FaqsModalProps } from "./FaqsModal.types";
import styles from "./FaqsModal.module.scss";

export const FaqsModal: React.FC<FaqsModalProps> = ({ onClose, className }) => (
  <Modal
    className={clsx(styles["faqs-modal"], className)}
    isOpened
    aria-labelledby="Prompt Wars FAQs Modal Window"
    onClose={onClose}
  >
    <Modal.Header onClose={onClose}>
      <Typography.Headline2 flat>FAQs</Typography.Headline2>
    </Modal.Header>
    <Modal.Content>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>How is each round resolved?</Typography.Headline3>
        <Typography.Text>
          When you submit your prompt, it is immutably stored in a smart-contract and linked to your wallet account.
          When the round ends, a secure Pulse server will reveal each prompt using the Stable Diffusion API and compare
          it to the image that was rendered. Comparison is made by pixelmatch. The comparison results in a number, the
          closest to 0 wins.
        </Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>How much does it cost?</Typography.Headline3>
        <Typography.Text>How much does it cost?</Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>How does Pulse make money?</Typography.Headline3>
        <Typography.Text>How does Pulse make money?</Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>Where are the images fetched from?</Typography.Headline3>
        <Typography.Text>Where are the images fetched from?</Typography.Text>
      </div>
    </Modal.Content>
  </Modal>
);
