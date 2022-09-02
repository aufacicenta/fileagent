import clsx from "clsx";
import { Form as RFForm } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import _ from "lodash";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Form } from "ui/form/Form";
import { Button } from "ui/button/Button";
import pulse from "providers/pulse";
import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";
import currency from "providers/currency";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";
import { useToastContext } from "hooks/useToastContext/useToastContext";

import { SwapCardForm, SwapCardProps } from "./SwapCard.types";
import styles from "./SwapCard.module.scss";

const DEFAULT_DEBOUNCE_TIME = 500;

// @TODO let's try https://www.npmjs.com/package/@lemoncode/fonk: required, valid number, enough balance
const validate = () => ({
  fromTokenAmount: undefined,
  toTokenAmount: undefined,
});

export const SwapCard: React.FC<SwapCardProps> = ({
  className,
  marketContractValues: {
    market,
    collateralTokenMetadata,
    feeRatio,
    isOver,
    isResolutionWindowExpired,
    isResolved,
    outcomeTokens,
  },
  selectedOutcomeToken,
  setSelectedOutcomeToken,
  marketId,
}) => {
  const [fromToken, setFromToken] = useState({ price: 0, symbol: "", amount: 0 });
  const [toToken, setToToken] = useState({ price: 0, symbol: "", amount: 0 });
  const [balance, setBalance] = useState("0.00");
  const [rate, setRate] = useState("0.00");
  const [fee, setFee] = useState("0.00");

  const { t } = useTranslation(["swap-card"]);
  const toast = useToastContext();

  const FungibleTokenContract = useNearFungibleTokenContract({ contractAddress: collateralTokenMetadata.id });
  const MarketContract = useNearMarketContract({ marketId, preventLoad: true });

  const collateralToken = pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id);
  const ftMetadata = FungibleTokenContract.metadata;

  const isCollateralSourceToken = () => fromToken.symbol === collateralToken.symbol;

  const setCollateralAsSource = async () => {
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

    const collateralTokenBalance = await FungibleTokenContract.getWalletBalance();
    setBalance(collateralTokenBalance);
  };

  useEffect(() => {
    setCollateralAsSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutcomeToken.outcome_id, ftMetadata?.decimals]);

  const getBuyRate = async (amount: number, setToTokenInputValue: (value: string) => void) => {
    const decimals = ftMetadata?.decimals!;

    const [, exchangeFee, , , amountMintable] = await MarketContract.getAmountMintable({
      amount: currency.convert.toUIntAmount(amount, decimals),
      outcome_id: selectedOutcomeToken.outcome_id,
    });

    const feeString = currency.convert.fromUIntAmount(exchangeFee, decimals).toString();
    const rateString = currency.convert.fromUIntAmount(amountMintable, decimals).toString();

    setFee(feeString);
    setRate(rateString);

    setToTokenInputValue(rateString);
  };

  const getSellRate = async (sellAmount: number, setToTokenInputValue: (value: string) => void) => {
    const decimals = ftMetadata?.decimals!;
    const amount = currency.convert.toUIntAmount(sellAmount, decimals);

    const [, amountPayable] = await MarketContract.getAmountPayable({
      amount,
      outcome_id: selectedOutcomeToken.outcome_id,
      balance: collateralTokenMetadata.balance,
    });

    const rateString = currency.convert.fromUIntAmount(amountPayable, decimals);

    setRate(rateString);

    setToTokenInputValue(rateString);
  };

  const onFromTokenChange = (value: string, mutator: (value: string) => void) => {
    if (isCollateralSourceToken()) {
      getBuyRate(Number(value), mutator);
    } else {
      getSellRate(Number(value), mutator);
    }
  };

  const buy = async (amount: number) => {
    if (isOver) {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Market is over",
        children: <Typography.Text>Cannot purchase market options on this event.</Typography.Text>,
      });

      return;
    }

    await FungibleTokenContract.ftTransferCall(marketId, amount.toString(), selectedOutcomeToken.outcome_id);
  };

  const sell = async (amount: number) => {
    await MarketContract.sell({
      outcome_id: selectedOutcomeToken.outcome_id,
      amount,
    });
  };

  const onSubmit = async ({ fromTokenAmount }: SwapCardForm) => {
    const decimals = ftMetadata?.decimals!;
    const amount = currency.convert.toUIntAmount(fromTokenAmount, decimals);

    if (isOver && isResolved) {
      await sell(amount);
    } else if (isCollateralSourceToken()) {
      await buy(amount);
    } else {
      await sell(amount);
    }
  };

  const getSubmitButton = () => {
    if (isOver && !isResolutionWindowExpired) {
      return (
        <Button fullWidth type="submit" disabled>
          Market is under resolution
        </Button>
      );
    }

    if (isOver && isResolutionWindowExpired) {
      return (
        <Button fullWidth type="submit">
          {t("swapCard.sell")}
        </Button>
      );
    }

    return (
      <Button fullWidth type="submit">
        {isCollateralSourceToken() ? t("swapCard.buy") : t("swapCard.sell")}
      </Button>
    );
  };

  const onSelectOutcomeToken = (id: string | number | ChangeEvent<HTMLSelectElement>) => {
    setSelectedOutcomeToken(outcomeTokens![id as number]);
  };

  // @TODO i18n
  return (
    <RFForm
      onSubmit={onSubmit}
      validate={validate}
      mutators={{
        setToTokenInputValue: (_args, state, utils) => (value: string) => {
          utils.changeValue(state, "toTokenAmount", () => value);
        },
      }}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(styles["swap-card"], className)}>
            <Card.Content>
              <Typography.Headline2 className={styles["swap-card__buy-sell"]}>
                {t("swapCard.title")}
              </Typography.Headline2>
              <div className={styles["swap-card__balance--container"]}>
                <Typography.Description className={styles["swap-card__balance--amount"]}>
                  {t("swapCard.balance")}: {balance} {fromToken.symbol}
                  {isCollateralSourceToken() && (
                    <img
                      src={pulse.getCollateralTokenIconByAccountId(collateralToken.accountId)}
                      alt="token-icon"
                      className={styles["swap-card__from--token-icon"]}
                    />
                  )}
                </Typography.Description>
                <div className={styles["swap-card__balance--half-max"]}>
                  <Typography.Description className={styles["swap-card__balance--half"]}>Half</Typography.Description>
                  <Typography.Description className={styles["swap-card__balance--max"]}>Max</Typography.Description>
                </div>
              </div>
              <div className={styles["swap-card__from"]}>
                <div className={styles["swap-card__from--token-amount"]}>
                  <OnChange name="fromTokenAmount">
                    {_.debounce(
                      (value) => onFromTokenChange(value, form.mutators.setToTokenInputValue()),
                      DEFAULT_DEBOUNCE_TIME,
                    )}
                  </OnChange>
                  <Form.TextInput
                    id="fromTokenAmount"
                    type="text"
                    defaultValue="0.00"
                    className={styles["swap-card__from--amount-input"]}
                  />
                  <Form.Select
                    id="outcomeTokenId"
                    className={styles["swap-card__select"]}
                    inputProps={{
                      onChange: onSelectOutcomeToken,
                      value: selectedOutcomeToken.outcome_id,
                    }}
                  >
                    {market.options.map((option, id) => (
                      <Form.Select.Item value={id} key={option}>
                        <Typography.Text flat truncate>
                          {option}
                        </Typography.Text>
                      </Form.Select.Item>
                    ))}
                  </Form.Select>
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
                  <Typography.Text flat>Price</Typography.Text>
                  <Typography.Text flat>
                    {Number(toToken.price).toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString()}
                  </Typography.Text>
                </div>
                <div className={styles["swap-card__overview-card--row"]}>
                  <Typography.Text flat>{t("swapCard.rate")}</Typography.Text>
                  <div className={styles["swap-card__overview-card--row-description"]}>
                    <Typography.Text flat>{rate}</Typography.Text>
                    <Typography.Description flat>
                      {toToken.symbol} / {fromToken.symbol}
                    </Typography.Description>
                  </div>
                </div>
              </div>
              {getSubmitButton()}
            </Card.Content>
          </Card>
        </form>
      )}
    />
  );
};
