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
import pulse from "providers/pulse";
import { Styles } from "ui/icon/Icon.module.scss";

import { CreateMarketModalProps } from "./CreateMarketModal.types";
import styles from "./CreateMarketModal.module.scss";

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ className, onClose }) => {
  const [collateralToken, setCollateralToken] = useState(pulse.getConfig().COLLATERAL_TOKENS[0].symbol);

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
                  <Form.Label htmlFor="marketDescription">
                    {t("latestTrends.createMarketModal.input.descriptionOfTheMarket")}
                  </Form.Label>
                  <Form.TextInput
                    id="marketDescription"
                    type="text"
                    placeholder={t("latestTrends.createMarketModal.input.descriptionOfTheMarket.placeholder")}
                  />
                </Grid.Col>
                <Grid.Col lg={6} xs={12}>
                  <Form.Label htmlFor="marketEndtime">
                    {t("latestTrends.createMarketModal.input.marketEndDatetime")}
                  </Form.Label>
                  <Form.TextInput
                    id="marketEndtime"
                    type="text"
                    placeholder={t("latestTrends.createMarketModal.input.marketEndDatetime.placeholder")}
                  />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col lg={6} xs={12}>
                  <Form.Label htmlFor="collateralToken">
                    {t("latestTrends.createMarketModal.input.collateralToken")}
                  </Form.Label>
                  <Form.Select
                    id="collateralToken"
                    inputProps={{
                      onChange: (value) => {
                        setCollateralToken(value as string);
                      },
                      value: collateralToken,
                    }}
                  >
                    {pulse.getConfig().COLLATERAL_TOKENS.map((token) => (
                      <Form.Select.Item value={token.symbol} key={token.symbol}>
                        <Typography.Text flat className={styles["create-market-modal__token"]}>
                          <span className={styles["create-market-modal__token--icon-box"]}>
                            <Icon
                              name={token.icon as keyof Styles}
                              className={styles["create-market-modal__token--icon"]}
                            />
                          </span>{" "}
                          {token.symbol}
                        </Typography.Text>
                      </Form.Select.Item>
                    ))}
                  </Form.Select>
                </Grid.Col>
              </Grid.Row>
              <div className={styles["create-market-modal__market-options"]}>
                <Form.Label id="marketOptions">{t("latestTrends.createMarketModal.input.marketOptions")}</Form.Label>
                <div className={styles["create-market-modal__market-options--option"]}>
                  <div className={styles["create-market-modal__market-options--option-input"]}>
                    <Form.TextInput
                      id="marketOption_1"
                      type="text"
                      placeholder={t("latestTrends.createMarketModal.input.marketOptions.placeholder")}
                    />
                  </div>
                  <div className={styles["create-market-modal__market-options--option-add-remove"]}>
                    <Icon name="icon-plus-circle" onClick={() => undefined} />
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Modal.Content>
        <Modal.Actions>
          <Button type="submit">Submit</Button>
        </Modal.Actions>
      </Form>
    </Modal>
  );
};
