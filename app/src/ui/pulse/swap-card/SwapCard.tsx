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
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { useWalletSelectorContext } from "hooks/useWalletSelectorContext/useWalletSelectorContext";
import { WalletSelectorChain } from "context/wallet/selector/WalletSelectorContext.types";
import { WrappedBalance } from "providers/near/contracts/market/market.types";

import styles from "./SwapCard.module.scss";
import { SwapCardForm, SwapCardProps, Token } from "./SwapCard.types";

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
    isOpen,
    isPublished,
    isResolutionWindowExpired,
    isResolved,
    outcomeTokens,
  },
  selectedOutcomeToken,
  setSelectedOutcomeToken,
  marketId,
}) => {
  const [fromToken, setFromToken] = useState<Token>({ price: 0, symbol: "", amount: 0 });
  const [toToken, setToToken] = useState<Token>({ price: 0, symbol: "", amount: 0 });
  const [balance, setBalance] = useState("0.00");
  const [rate, setRate] = useState("0.00");
  const [fee, setFee] = useState("0.00");

  const wallet = useWalletStateContext();
  const walletSelector = useWalletSelectorContext();
  const { t } = useTranslation(["swap-card"]);
  const toast = useToastContext();

  const FungibleTokenContract = useNearFungibleTokenContract({ contractAddress: collateralTokenMetadata.id });
  const MarketContract = useNearMarketContract({ marketId, preventLoad: true });

  const collateralToken = pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id);
  const ftMetadata = FungibleTokenContract.metadata;

  const isCollateralSourceToken = () => fromToken.symbol === collateralToken.symbol;
  const canClaim = isResolved || (isOver && isResolutionWindowExpired);
  const isResolutionWindowOpen = isOver && !isResolutionWindowExpired && !isPublished;
  const isBettingWindowClosed = !isOpen || isResolutionWindowOpen || canClaim;
  const isUnderResolution = !isResolved && isOver && !isResolutionWindowExpired;

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

  const setOutcomeAsSource = async () => {
    setToToken({
      price: collateralToken.price,
      symbol: collateralToken.symbol,
      amount: 0,
    });

    setFromToken({
      price: selectedOutcomeToken.price,
      symbol: market.options[selectedOutcomeToken.outcome_id],
      amount: 0,
    });

    const outcomeTokenBalance = await MarketContract.getBalanceOf({ outcome_id: selectedOutcomeToken.outcome_id });
    setBalance(currency.convert.toDecimalsPrecisionString(outcomeTokenBalance, ftMetadata?.decimals!));
  };

  useEffect(() => {
    if (canClaim) {
      setOutcomeAsSource();
    } else {
      setCollateralAsSource();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutcomeToken.outcome_id, ftMetadata?.decimals]);

  const getBuyRate = async (buyAmount: WrappedBalance) => {
    const decimals = ftMetadata?.decimals!;
    const amount = Number(currency.convert.toUIntAmount(buyAmount, decimals));

    const [, exchangeFee, , , amountMintable] = await MarketContract.getAmountMintable({
      amount,
      outcome_id: selectedOutcomeToken.outcome_id,
    });

    const feeString = currency.convert.fromUIntAmount(exchangeFee, decimals).toString();
    const rateString = currency.convert.fromUIntAmount(amountMintable, decimals).toString();

    setFee(feeString);
    setRate(rateString);
  };

  const getSellRate = async (sellAmount: WrappedBalance) => {
    const decimals = ftMetadata?.decimals!;
    const amount = Number(currency.convert.toUIntAmount(sellAmount, decimals));

    const [, amountPayable] = await MarketContract.getAmountPayable({
      amount,
      outcome_id: selectedOutcomeToken.outcome_id,
      balance: collateralTokenMetadata.balance,
    });

    const rateString = currency.convert.fromUIntAmount(amountPayable, decimals);

    setRate(rateString);
  };

  const onFromTokenChange = (value: string) => {
    if (isCollateralSourceToken()) {
      getBuyRate(Number(value));
    } else {
      getSellRate(Number(value));
    }
  };

  const buy = async (amount: string) => {
    if (isOver) {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Market is over",
        children: <Typography.Text>Cannot purchase market options on this event.</Typography.Text>,
      });

      return;
    }

    await FungibleTokenContract.ftTransferCall(marketId, amount, selectedOutcomeToken.outcome_id);
  };

  const sell = async (sellAmount: string) => {
    const amount = Number(sellAmount);

    await MarketContract.sell({
      outcome_id: selectedOutcomeToken.outcome_id,
      amount,
    });
  };

  const onSubmit = async ({ fromTokenAmount }: SwapCardForm) => {
    const decimals = ftMetadata?.decimals!;
    const amount = currency.convert.toUIntAmount(fromTokenAmount, decimals);

    await (isOver && isResolved ? sell(amount) : buy(amount));
  };

  const getSubmitButton = () => {
    if (!wallet.isConnected.get()) {
      return (
        <Button fullWidth onClick={() => walletSelector.onConnect(WalletSelectorChain.near)}>
          {canClaim ? "Connect to Claim" : "Connect to Bet"}
        </Button>
      );
    }

    if (isResolutionWindowOpen) {
      return (
        <Button fullWidth onClick={MarketContract.onClickPublishMarket}>
          Submit to Resolution
        </Button>
      );
    }

    if (isUnderResolution) {
      return (
        <Button fullWidth disabled>
          Market is under resolution
        </Button>
      );
    }

    if (isBettingWindowClosed) {
      return (
        <Button fullWidth disabled>
          Betting is Closed
        </Button>
      );
    }

    if (canClaim) {
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

  const onClickHalfBalance = (setFromTokenInputValue: (value: string) => void) => {
    const amount = Number(balance) / 2;
    setFromTokenInputValue(amount.toString());
    getBuyRate(amount);
  };

  const onClickMaxBalance = (setFromTokenInputValue: (value: string) => void) => {
    const amount = Number(balance);
    setFromTokenInputValue(amount.toString());
    getBuyRate(amount);
  };

  // @TODO i18n
  return (
    <RFForm
      onSubmit={onSubmit}
      validate={validate}
      mutators={{
        setFromTokenInputValue: (_args, state, utils) => (value: string) => {
          utils.changeValue(state, "fromTokenAmount", () => value);
        },
      }}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(styles["swap-card"], className)}>
            <Card.Content>
              <Typography.Headline2 className={styles["swap-card__buy-sell"]}>
                {isBettingWindowClosed ? t("swapCard.title.claim") : t("swapCard.title")}
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
                  <Typography.Description
                    className={styles["swap-card__balance--half"]}
                    onClick={() => onClickHalfBalance(form.mutators.setFromTokenInputValue())}
                  >
                    Half
                  </Typography.Description>
                  <Typography.Description
                    className={styles["swap-card__balance--max"]}
                    onClick={() => onClickMaxBalance(form.mutators.setFromTokenInputValue())}
                  >
                    Max
                  </Typography.Description>
                </div>
              </div>
              <div className={styles["swap-card__from"]}>
                <div className={styles["swap-card__from--token-amount"]}>
                  <OnChange name="fromTokenAmount">
                    {_.debounce((value) => onFromTokenChange(value), DEFAULT_DEBOUNCE_TIME)}
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
                {!canClaim && (
                  <div className={styles["swap-card__overview-card--row"]}>
                    <Typography.Text flat>
                      {t("swapCard.estimatedFee")} ({Number(feeRatio) * 100}%)
                    </Typography.Text>
                    {fromToken.symbol === collateralToken.symbol ? (
                      <Typography.Text flat>
                        {fee} {fromToken.symbol}
                      </Typography.Text>
                    ) : (
                      <Typography.Text flat>none for sells</Typography.Text>
                    )}
                  </div>
                )}
                {!canClaim && (
                  <div className={styles["swap-card__overview-card--row"]}>
                    <Typography.Text flat>Price</Typography.Text>
                    <Typography.Text flat>
                      {Number(toToken.price).toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION).toString()}
                    </Typography.Text>
                  </div>
                )}
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
