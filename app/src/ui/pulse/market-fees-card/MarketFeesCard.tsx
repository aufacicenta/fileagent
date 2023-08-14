import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "next-i18next";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Modal } from "ui/modal/Modal";

import { MarketFeesCardProps } from "./MarketFeesCard.types";
import styles from "./MarketFeesCard.module.scss";

// @TODO i18n
export const MarketFeesCard: React.FC<MarketFeesCardProps> = ({ className }) => {
  const [isLearnMoreModalVisible, displayLearnModal] = useState(false);

  const onCloseLearnMoreModal = () => displayLearnModal(false);

  const { t } = useTranslation(["prompt-wars"]);

  return (
    <>
      <Modal
        isOpened={isLearnMoreModalVisible}
        aria-labelledby="Create Market Modal Window"
        onClose={onCloseLearnMoreModal}
      >
        <Modal.Header onClose={onCloseLearnMoreModal}>
          <Typography.Headline2 flat>{t("promptWars.marketFeesCard.stakeToEarn")} </Typography.Headline2>
        </Modal.Header>
        <Modal.Content>
          <Typography.TextLead>{t("promptWars.marketFeesCard.percentageDistributedBy")}:</Typography.TextLead>
          <Typography.Text>{t("promptWars.marketFeesCard.percentageDistributedCreators")}</Typography.Text>
          <Typography.Text>{t("promptWars.marketFeesCard.percentageDistributedStakers")}</Typography.Text>
          <Typography.Text flat>{t("promptWars.marketFeesCard.percentageDistributedPublisher")}</Typography.Text>
        </Modal.Content>
        <Modal.Actions>
          <Typography.Anchor
            href="https://app.ref.finance/#wrap.near|52a047ee205701895ee06a375492490ec9c597ce.factory.bridge.near"
            rel="nofollow"
            target="_blank"
            as="button"
          >
            {t("promptWars.marketFeesCard.stakeNow")}
          </Typography.Anchor>
        </Modal.Actions>
      </Modal>

      <Card className={clsx(styles["market-fees-card"], className)}>
        <Card.Content>
          <Typography.Headline2>{t("promptWars.marketFeesCard.disclaimer")}</Typography.Headline2>
          <Typography.Text>{t("promptWars.marketFeesCard.disclaimerDescription")}</Typography.Text>
        </Card.Content>
      </Card>
    </>
  );
};
