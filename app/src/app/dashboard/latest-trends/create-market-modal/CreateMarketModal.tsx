import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import { Card } from "ui/card/Card";
import { Form } from "ui/form/Form";
import { Grid } from "ui/grid/Grid";

import { CreateMarketModalProps } from "./CreateMarketModal.types";
import styles from "./CreateMarketModal.module.scss";

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ className, onClose }) => {
  const { t } = useTranslation(["latest-trends", "common"]);

  return (
    <Modal
      className={clsx(styles["create-market-modal"], className)}
      isOpened
      aria-labelledby="Create Market Modal Window"
      onClose={onClose}
    >
      <Form onSubmit={() => undefined}>
        <Modal.Header onClose={onClose}>
          <Typography.Headline2 flat>{t("latestTrends.createMarketModal.title")}</Typography.Headline2>
        </Modal.Header>
        <Modal.Content className={styles["create-market-modal__modal-content"]}>
          <div className={styles["create-market-modal__categories"]}>
            <Typography.Headline3>{t("latestTrends.createMarketModal.selectCategories")}</Typography.Headline3>
          </div>
          <Card className={styles["create-market-modal__market-details-card"]}>
            <Card.Content>
              <Typography.Headline3>{t("latestTrends.createMarketModal.marketDetails")}</Typography.Headline3>
              <Grid.Row>
                <Grid.Col lg={6} xs={12}>
                  <Form.TextInput
                    id="market-description"
                    type="text"
                    label={t("latestTrends.createMarketModal.input.descriptionOfTheMarket")}
                    placeholder={t("latestTrends.createMarketModal.input.descriptionOfTheMarket.placeholder")}
                    autoFocus
                  />
                </Grid.Col>
                <Grid.Col lg={6} xs={12}>
                  <Form.TextInput
                    id="market-resolution-info"
                    type="text"
                    label={t("latestTrends.createMarketModal.input.resolutionInfo")}
                    placeholder={t("latestTrends.createMarketModal.input.resolutionInfo.placeholder")}
                  />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col lg={6} xs={12}>
                  <Form.TextInput
                    id="market-endtime"
                    type="text"
                    label={t("latestTrends.createMarketModal.input.marketEndDatetime")}
                    placeholder={t("latestTrends.createMarketModal.input.marketEndDatetime.placeholder")}
                  />
                </Grid.Col>
              </Grid.Row>
            </Card.Content>
          </Card>
        </Modal.Content>
      </Form>
    </Modal>
  );
};
