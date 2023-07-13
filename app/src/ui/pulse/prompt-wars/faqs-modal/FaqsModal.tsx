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
        <Typography.Headline3>Are there humans involved in the comparison?</Typography.Headline3>
        <Typography.Text>
          No, everything is compared by using AI and an image processing library called jimp that calculates the pixel
          difference of the prompts and the source image. The result may vary depending on the final colors, object
          positioning, and other elements that may not be present in the source image.
        </Typography.Text>
        <Typography.Text>
          TIP: use the negative prompt to write everything that you don't want to see in the final image.
        </Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>When can I see the results of a given round?</Typography.Headline3>
        <Typography.Text>
          At the end of the resolution period (when the comparison is made), you will be able to see the results of each
          game.
        </Typography.Text>
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
        <Typography.Headline3>
          How to get <code>{pulse.getDefaultCollateralToken().accountId}</code> NEAR?
        </Typography.Headline3>
        <Typography.Text>
          If you already own some Bitcoin, BTC or Ethereum, ETH; you can get NEAR and therefore{" "}
          <code>{pulse.getDefaultCollateralToken().accountId}</code>. All of{" "}
          <Typography.Anchor href="https://www.coingecko.com/en/coins/near#markets" rel="nofollow" target="_blank">
            these markets listed at coingecko.com
          </Typography.Anchor>{" "}
          can be used to buy NEAR.
        </Typography.Text>
        <Typography.Text>
          Once you have NEAR, you can then swap it for <code>{pulse.getDefaultCollateralToken().accountId}</code> using
          tools like{" "}
          <Typography.Anchor href="https://app.ref.finance/#near|usdt.tether-token.near" target="_blank" rel="nofollow">
            app.ref.finance
          </Typography.Anchor>
          .
        </Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>Can I withdraw my funds if there are no other players?</Typography.Headline3>
        <Typography.Text>
          Absolutely. If there are no other players, you can withdraw your funds 7 days before the contract is destroyed
          and all the funds are transferred to the Prompt Wars DAO.
        </Typography.Text>
        <Typography.Text>
          Funds can also be withdrawn if a game was not resolved (winner anounced) during the resolution period.
        </Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>How much does each round cost?</Typography.Headline3>
        <Typography.Text>
          Each round has a set price of {pulse.getDefaultCollateralToken().symbol} 10.00{" "}
          <code>{pulse.getDefaultCollateralToken().accountId}</code>. Prompt Wars charges a fee of 20% on each round.
        </Typography.Text>
      </div>
      <div className={styles["faqs-modal__item"]}>
        <Typography.Headline3>What happens if I win a round?</Typography.Headline3>
        <Typography.Text>
          Simple: you get all the price bag automatically transferred to your NEAR wallet. This happens if there are
          more players in the same round, of course. This will happen also after the game has been resolved, eg.
          determine the prompt result closest to the source image.
        </Typography.Text>
      </div>
    </Modal.Content>
  </Modal>
);
