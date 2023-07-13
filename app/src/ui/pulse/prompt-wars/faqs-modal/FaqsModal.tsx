import clsx from "clsx";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import pulse from "providers/pulse";

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
          When the round ends, a secure server will reveal each prompt using the Stable Diffusion API and compare it to
          the image that was rendered. Comparison is made by jimp. The comparison results in a number, the closest to 0
          wins.
        </Typography.Text>
        <Typography.Text>New games start every 15 minutes.</Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>How to play?</Typography.Headline3>
        <Typography.Text>
          Simply connect your NEAR Protocol wallet, get at least {pulse.getDefaultCollateralToken().symbol} 10.00{" "}
          <code>{pulse.getDefaultCollateralToken().accountId}</code> and submit your prompt within the submission
          period.
        </Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>Can I withdraw my funds if there are no other players?</Typography.Headline3>
        <Typography.Text>
          Absolutely. If there are no other players, you can withdraw your funds 30 days before the contract is
          destroyed and all the funds are transferred to the Prompt Wars DAO.
        </Typography.Text>
        <Typography.Text>
          Funds can also be withdrawn if a game was not resolved (winner anounced) during the resolution period.
        </Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>How much does it cost?</Typography.Headline3>
        <Typography.Text>
          Each round has a set price of {pulse.getDefaultCollateralToken().symbol} 10.00{" "}
          <code>{pulse.getDefaultCollateralToken().accountId}</code>. Prompt Wars charges a fee of 20% on each round.
        </Typography.Text>
      </div>
    </Modal.Content>
  </Modal>
);
