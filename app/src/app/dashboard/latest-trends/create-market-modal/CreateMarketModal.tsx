import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import { Card } from "ui/card/Card";
import { Form } from "ui/form/Form";
import { Grid } from "ui/grid/Grid";
import { Button } from "ui/button/Button";
import { Icon } from "ui/icon/Icon";

import { CreateMarketModalProps } from "./CreateMarketModal.types";
import styles from "./CreateMarketModal.module.scss";

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ className, onClose }) => {
  const [collateralToken, setCollateralToken] = useState("token1");

  const { t } = useTranslation(["latest-trends", "common"]);

  const onSubmit = (values: Record<string, unknown>) => {
    console.log({ ...values, collateralToken });
  };

  return (
    <Modal
      className={clsx(styles["create-market-modal"], className)}
      isOpened
      aria-labelledby="Create Market Modal Window"
      onClose={onClose}
    >
      <Form onSubmit={onSubmit}>
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
                    id="marketDescription"
                    type="text"
                    label={t("latestTrends.createMarketModal.input.descriptionOfTheMarket")}
                    placeholder={t("latestTrends.createMarketModal.input.descriptionOfTheMarket.placeholder")}
                  />
                </Grid.Col>
                <Grid.Col lg={6} xs={12}>
                  <Form.TextInput
                    id="marketEndtime"
                    type="text"
                    label={t("latestTrends.createMarketModal.input.marketEndDatetime")}
                    placeholder={t("latestTrends.createMarketModal.input.marketEndDatetime.placeholder")}
                  />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col lg={6} xs={12}>
                  <Form.Select
                    id="collateralToken"
                    label={t("latestTrends.createMarketModal.input.collateralToken")}
                    inputProps={{
                      onChange: (value) => {
                        setCollateralToken(value as string);
                      },
                      value: collateralToken,
                    }}
                  >
                    <Form.Select.Item value="token1" key="token1">
                      <Typography.Text flat>
                        <Icon name="icon-abacus" /> token1
                      </Typography.Text>
                    </Form.Select.Item>
                    <Form.Select.Item value="token2" key="token2">
                      <Typography.Text flat>
                        <Icon name="icon-abacus" /> token2
                      </Typography.Text>
                    </Form.Select.Item>
                  </Form.Select>
                </Grid.Col>
              </Grid.Row>
            </Card.Content>
            <Card.Actions>
              <Button type="submit">Submit</Button>
            </Card.Actions>
          </Card>
        </Modal.Content>
      </Form>
    </Modal>
  );
};
