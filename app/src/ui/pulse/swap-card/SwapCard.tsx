import clsx from "clsx";
import { Form as RFForm } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { Form } from "ui/form/Form";
import { Button } from "ui/button/Button";
import pulse from "providers/pulse";
import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";
import currency from "providers/currency";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";

import { SwapCardForm, SwapCardProps } from "./SwapCard.types";
import styles from "./SwapCard.module.scss";

const DEFAULT_DEBOUNCE_TIME = 500;

const onSubmit = (values: SwapCardForm) => {
  console.log(values);

  // if (isCollateralTokenSource()) {
  // } else {
  // }
};

const onToTokenChange = (value: string, previous: string) => {
  console.log(value, previous);
};

// @TODO let's try https://www.npmjs.com/package/@lemoncode/fonk: required, valid number, enough balance
const validate = () => ({
  fromTokenAmount: undefined,
  toTokenAmount: undefined,
});

export const SwapCard: React.FC<SwapCardProps> = ({
  className,
  marketContractValues: { market, collateralTokenMetadata, feeRatio },
  selectedOutcomeToken,
  marketId,
}) => {
  const [fromToken, setFromToken] = useState({ price: 0, symbol: "", amount: 0 });
  const [toToken, setToToken] = useState({ price: 0, symbol: "", amount: 0 });
  const [balance, setBalance] = useState("0.00");
  const [rate, setRate] = useState("0.00");
  const [fee, setFee] = useState("0.00");

  const { t } = useTranslation(["swap-card"]);
  const FungibleTokenContract = useNearFungibleTokenContract();
  const MarketContract = useNearMarketContract({ marketId, preventLoad: true });

  const collateralToken = pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id);

  const isCollateralSourceToken = () => fromToken.symbol === collateralToken.symbol;

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

    const collateralTokenBalance = await FungibleTokenContract.getWalletBalance(collateralTokenMetadata.id);
    setBalance(collateralTokenBalance);
  }, [
    collateralToken.price,
    collateralToken.symbol,
    selectedOutcomeToken.price,
    selectedOutcomeToken.outcome_id,
    market.options,
    FungibleTokenContract,
    collateralTokenMetadata.id,
  ]);

  const setOutcomeAsSource = useCallback(async () => {
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
    const outcomeTokenBalance = await MarketContract.getBalanceOf({ outcome_id: selectedOutcomeToken.outcome_id });
    setBalance(outcomeTokenBalance.toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString());
  }, [
    MarketContract,
    collateralToken.price,
    collateralToken.symbol,
    market.options,
    selectedOutcomeToken.outcome_id,
    selectedOutcomeToken.price,
  ]);

  useEffect(() => {
    setCollateralAsSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutcomeToken]);

  const onClickFlip = () => {
    if (isCollateralSourceToken()) {
      setOutcomeAsSource();
    } else {
      setCollateralAsSource();
    }
  };

  // @TODO fetch rate from MarketContract.getAmountMintable
  const getBuyRate = async (amount: number) => {
    const [, exchangeFee, , , amountMintable] = await MarketContract.getAmountMintable({
      amount,
      outcome_id: selectedOutcomeToken.outcome_id,
    });

    setFee(exchangeFee.toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString());
    setRate(amountMintable.toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString());
  };

  // @TODO fetch rate from MarketContract.getAmountPayable
  const getSellRate = async (amount: number) => {
    const [, amountPayable] = await MarketContract.getAmountPayable({
      amount,
      outcome_id: selectedOutcomeToken.outcome_id,
      balance: amount,
    });

    setRate(amountPayable.toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString());
  };

  const onFromTokenChange = (value: string) => {
    if (isCollateralSourceToken()) {
      getBuyRate(Number(value));
    } else {
      getSellRate(Number(value));
    }
  };

  // @TODO i18n
  return (
    <RFForm
      onSubmit={onSubmit}
      validate={validate}
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
                    {fromToken.symbol}:{" "}
                    {Number(fromToken.price).toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString()}
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
                  <OnChange name="fromTokenAmount">{_.debounce(onFromTokenChange, DEFAULT_DEBOUNCE_TIME)}</OnChange>
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
                    {toToken.symbol}:{" "}
                    {Number(toToken.price).toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString()}
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
                  <OnChange name="toTokenAmount">{_.debounce(onToTokenChange, DEFAULT_DEBOUNCE_TIME)}</OnChange>
                </div>
              </div>
              <Typography.Description className={styles["swap-card__overview"]}>
                {t("swapCard.overview")}
              </Typography.Description>
              <div className={styles["swap-card__overview-card"]}>
                <div className={styles["swap-card__overview-card--row"]}>
                  <Typography.Text flat>
                    {t("swapCard.estimatedFee")} ({feeRatio * 100}%)
                  </Typography.Text>
                  {fromToken.symbol === collateralToken.symbol ? (
                    <Typography.Text flat>
                      {fee} {fromToken.symbol}
                    </Typography.Text>
                  ) : (
                    <Typography.Text flat>none for sells</Typography.Text>
                  )}
                </div>
                <div className={styles["swap-card__overview-card--row"]}>
                  <Typography.Text flat>{t("swapCard.rate")}</Typography.Text>
                  <Typography.Text flat>
                    {rate} {toToken.symbol} / {fromToken.symbol}
                  </Typography.Text>
                </div>
              </div>
              <Button fullWidth type="submit">
                {isCollateralSourceToken() ? t("swapCard.buy") : t("swapCard.sell")}
              </Button>
            </Card.Content>
          </Card>
        </form>
      )}
    />
  );
};
