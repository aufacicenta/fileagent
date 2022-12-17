import clsx from "clsx";
import { useState } from "react";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Modal } from "ui/modal/Modal";

import { MarketFeesCardProps } from "./MarketFeesCard.types";
import styles from "./MarketFeesCard.module.scss";

// @TODO i18n
export const MarketFeesCard: React.FC<MarketFeesCardProps> = ({ className }) => {
  const [isLearnMoreModalVisible, displayLearnModal] = useState(false);

  const onCloseLearnMoreModal = () => displayLearnModal(false);

  return (
    <>
      <Modal
        isOpened={isLearnMoreModalVisible}
        aria-labelledby="Create Market Modal Window"
        onClose={onCloseLearnMoreModal}
      >
        <Modal.Header onClose={onCloseLearnMoreModal}>
          <Typography.Headline2 flat>Stake $PULSE to earn market fees</Typography.Headline2>
        </Modal.Header>
        <Modal.Content>
          <Typography.TextLead>2% of this market total value is distributed by:</Typography.TextLead>
          <Typography.Text>80% for market creator</Typography.Text>
          <Typography.Text>15% for $PULSE stakers</Typography.Text>
          <Typography.Text flat>5% for market publisher</Typography.Text>
        </Modal.Content>
        <Modal.Actions>
          <Typography.Anchor
            href="https://app.ref.finance/#wrap.near|52a047ee205701895ee06a375492490ec9c597ce.factory.bridge.near"
            rel="nofollow"
            target="_blank"
            as="button"
          >
            Stake $PULSE now!
          </Typography.Anchor>
        </Modal.Actions>
      </Modal>

      <Card className={clsx(styles["market-fees-card"], className)}>
        <Card.Content>
          <Typography.Headline2>Disclaimer</Typography.Headline2>
          <Typography.Text>
            This is a beta dApp. Pulse contracts have not been audited. Use at your own risk.
          </Typography.Text>
        </Card.Content>
      </Card>
    </>
  );
};
