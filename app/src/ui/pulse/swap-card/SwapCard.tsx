import clsx from "clsx";
import { Form as RFForm } from "react-final-form";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { Form } from "ui/form/Form";
import { Button } from "ui/button/Button";
import pulse from "providers/pulse";
import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";

import { SwapCardProps } from "./SwapCard.types";
import styles from "./SwapCard.module.scss";

export const SwapCard: React.FC<SwapCardProps> = ({
  className,
  onSubmit,
  marketContractValues: { market, collateralTokenMetadata },
  selectedOutcomeToken,
}) => {
  const [fromToken, setFromToken] = useState({ price: 0, symbol: "", amount: 0 });
  const [toToken, setToToken] = useState({ price: 0, symbol: "", amount: 0 });
  const [balance, setBalance] = useState("0.00");

  const { t } = useTranslation(["swap-card"]);
  const { getWalletBalance } = useNearFungibleTokenContract();

  const collateralToken = pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id);

  const setCollateralAsSource = useCallback(async () => {
    setFromToken({
      price: collateralToken.price,
      symbol: collateralToken.symbol,
      amount: 0,
    });

    setToToken({
      price: selectedOutcomeToken.price,
      symbol: market.options[selectedOutcomeToken.outcome_id],
      amount: 0,
    });

    const walletBalance = await getWalletBalance(collateralTokenMetadata.id);
    setBalance(walletBalance);
  }, [
    collateralToken.price,
    collateralToken.symbol,
    collateralTokenMetadata.id,
    getWalletBalance,
    market.options,
    selectedOutcomeToken.outcome_id,
    selectedOutcomeToken.price,
  ]);

  const setOutcomeAsSource = useCallback(() => {
    setFromToken({
      price: selectedOutcomeToken.price,
      symbol: market.options[selectedOutcomeToken.outcome_id],
      amount: 0,
    });

    setToToken({
      // @TODO get price from source like coingecko
      price: collateralToken.price,
      symbol: collateralToken.symbol,
      amount: 0,
    });

    // @TODO get balance of outcome token
    setBalance("0.00");
  }, [
    collateralToken.price,
    collateralToken.symbol,
    market.options,
    selectedOutcomeToken.outcome_id,
    selectedOutcomeToken.price,
  ]);

  useEffect(() => {
    setCollateralAsSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCollateralAsSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutcomeToken]);

  const onClickFlip = () => {
    if (fromToken.symbol === collateralToken.symbol) {
      setOutcomeAsSource();
    } else {
      setCollateralAsSource();
    }
  };

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
                {t("swapCard.balance")}: {balance}
              </Typography.Description>
              <div className={styles["swap-card__from"]}>
                <div className={styles["swap-card__from--name-price"]}>
                  <Typography.Description>Price</Typography.Description>
                  <Typography.Text>
                    {fromToken.symbol} {fromToken.price}
                  </Typography.Text>
                </div>
                <div className={styles["swap-card__from--token-amount"]}>
                  <Form.Label id="marketOptions" className={styles["swap-card__from--label"]}>
                    <Icon name="icon-near" />
                    <Typography.Text flat>{fromToken.symbol}</Typography.Text>
                  </Form.Label>
                  <Form.TextInput
                    id="fromTokenAmount"
                    type="text"
                    placeholder="0.00"
                    className={styles["swap-card__from--amount-input"]}
                  />
                </div>
                <div className={styles["swap-card__from--switch"]}>
                  <Button onClick={onClickFlip}>
                    <Icon name="icon-tab" />
                  </Button>
                </div>
              </div>
              <div className={styles["swap-card__to"]}>
                <div className={styles["swap-card__to--name-price"]}>
                  <Typography.Description>Price</Typography.Description>
                  <Typography.Text>
                    {toToken.symbol} {selectedOutcomeToken.price}
                  </Typography.Text>
                </div>
                <div className={styles["swap-card__to--token-amount"]}>
                  <Form.Label id="marketOptions" className={styles["swap-card__to--label"]}>
                    <Icon name="icon-near" />
                    <Typography.Text flat>{toToken.symbol}</Typography.Text>
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
                  {fromToken.symbol === collateralToken.symbol ? (
                    <Typography.Text flat>0 {fromToken.symbol}</Typography.Text>
                  ) : (
                    <Typography.Text flat>none for sells</Typography.Text>
                  )}
                </div>
                <div className={styles["swap-card__overview-card--row"]}>
                  <Typography.Text flat>{t("swapCard.rate")}</Typography.Text>
                  <Typography.Text flat>
                    0 {toToken.symbol} / {fromToken.symbol}
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
