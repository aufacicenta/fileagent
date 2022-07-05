import clsx from "clsx";
import { Form as RFForm } from "react-final-form";
import { useTranslation } from "next-i18next";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { Form } from "ui/form/Form";
import { Button } from "ui/button/Button";
import pulse from "providers/pulse";

import { SwapCardProps } from "./SwapCard.types";
import styles from "./SwapCard.module.scss";

export const SwapCard: React.FC<SwapCardProps> = ({
  className,
  onSubmit,
  marketContractValues: { market, collateralTokenMetadata },
  selectedOutcomeToken,
}) => {
  const { t } = useTranslation(["swap-card"]);

  const outcomeTokenName = market.options[selectedOutcomeToken.outcome_id];
  const collateralTokenSymbol = pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id).symbol;
  // @TODO get price from source like coingecko
  const collateralTokenPrice = pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id).price;

  return (
    <RFForm
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(styles["swap-card"], className)}>
            <Card.Content>
              <Typography.Headline2 className={styles["swap-card__buy-sell"]}>
                {t("swapCard.title")}
              </Typography.Headline2>
              <Typography.Description className={styles["swap-card__balance"]}>
                {/* @TODO get ft_balance from NEP141 token */}
                {t("swapCard.balance")}: 0.00
              </Typography.Description>
              <div className={styles["swap-card__from"]}>
                <div className={styles["swap-card__from--name-price"]}>
                  <Typography.Text>
                    {collateralTokenSymbol} {collateralTokenPrice}
                  </Typography.Text>
                </div>
                <div className={styles["swap-card__from--token-amount"]}>
                  <Form.Label id="marketOptions" className={styles["swap-card__from--label"]}>
                    <Icon name="icon-near" />
                    <Typography.Text flat>{collateralTokenSymbol}</Typography.Text>
                  </Form.Label>
                  <Form.TextInput
                    id="fromTokenAmount"
                    type="text"
                    placeholder="0.00"
                    className={styles["swap-card__from--amount-input"]}
                  />
                </div>
                <div className={styles["swap-card__from--switch"]}>
                  <div>
                    <Icon name="icon-tab" />
                  </div>
                </div>
              </div>
              <div className={styles["swap-card__to"]}>
                <div className={styles["swap-card__to--name-price"]}>
                  <Typography.Text>
                    {outcomeTokenName} {selectedOutcomeToken.price}
                  </Typography.Text>
                </div>
                <div className={styles["swap-card__to--token-amount"]}>
                  <Form.Label id="marketOptions" className={styles["swap-card__to--label"]}>
                    <Icon name="icon-near" />
                    <Typography.Text flat>{outcomeTokenName}</Typography.Text>
                  </Form.Label>
                  <Form.TextInput
                    id="toTokenAmount"
                    type="text"
                    placeholder="0.00"
                    className={styles["swap-card__to--amount-input"]}
                  />
                </div>
              </div>
              <Typography.Description className={styles["swap-card__overview"]}>
                {t("swapCard.overview")}
              </Typography.Description>
              <div className={styles["swap-card__overview-card"]}>
                <div className={styles["swap-card__overview-card--row"]}>
                  <Typography.Text flat>{t("swapCard.estimatedFee")}</Typography.Text>
                  <Typography.Text flat>0 {collateralTokenSymbol}</Typography.Text>
                </div>
                <div className={styles["swap-card__overview-card--row"]}>
                  <Typography.Text flat>{t("swapCard.rate")}</Typography.Text>
                  <Typography.Text flat>
                    0 {outcomeTokenName} / {collateralTokenSymbol}
                  </Typography.Text>
                </div>
              </div>
              <Button fullWidth>{t("swapCard.swap")}</Button>
            </Card.Content>
          </Card>
        </form>
      )}
    />
  );
};
