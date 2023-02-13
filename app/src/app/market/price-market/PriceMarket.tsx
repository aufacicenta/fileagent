import Countdown from "react-countdown";
import clsx from "clsx";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Grid } from "ui/grid/Grid";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import { Card } from "ui/card/Card";
import { OutcomeToken } from "providers/near/contracts/market/market.types";
import { SwapCardProps } from "ui/pulse/swap-card/SwapCard.types";
import switchboard from "providers/switchboard";
import currency from "providers/currency";
import { Typography } from "ui/typography/Typography";
import date from "providers/date";
import { Button } from "ui/button/Button";
import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";

import { PriceMarketProps } from "./PriceMarket.types";
import styles from "./PriceMarket.module.scss";
import { CreatePriceMarketModalProps } from "./create-price-market-modal/CreatePriceMarketModal.types";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

const CreatePriceMarketModal = dynamic<CreatePriceMarketModalProps>(
  () => import("./create-price-market-modal/CreatePriceMarketModal").then((mod) => mod.CreatePriceMarketModal),
  { ssr: false },
);

export const PriceMarket: React.FC<PriceMarketProps> = ({ className, marketId, marketContractValues }) => {
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<OutcomeToken | undefined>(undefined);
  const [currentPrice, setCurrentPrice] = useState<string | undefined>(currency.convert.toFormattedString(0));
  const [isBettingEnabled, setIsBettingEnabled] = useState(true);
  const [isCreatePriceMarketModalVisible, setIsCreatePriceMarketModalVisible] = useState(false);

  const {
    onClickResolveMarket,
    bettingPeriodExpired,
    actions: nearMarketContractContextActions,
  } = useNearMarketContractContext();

  const { market, buySellTimestamp, outcomeTokens, isOver, isResolutionWindowExpired, isResolved } =
    marketContractValues;

  const diff = date.client(buySellTimestamp - market.starts_at).minutes();
  const isBettingPeriodEnding = () => date.client(buySellTimestamp).diff(date.now()) < 1000 * 60;

  const updateCurrentPrice = async () => {
    const price = await switchboard.fetchCurrentPrice(switchboard.jobs.testnet.near.btcUsd);
    setCurrentPrice(currency.convert.toFormattedString(price));
  };

  useEffect(() => {
    if (outcomeTokens) {
      setSelectedOutcomeToken(outcomeTokens[0]);
    }
  }, [outcomeTokens]);

  useEffect(() => {
    if (nearMarketContractContextActions.fetchMarketContractValues.isLoading) {
      return undefined;
    }

    updateCurrentPrice();
    setIsBettingEnabled(!bettingPeriodExpired());

    const interval = setInterval(async () => {
      updateCurrentPrice();

      if (bettingPeriodExpired()) {
        updateCurrentPrice();
        setIsBettingEnabled(false);
        clearInterval(interval);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [marketId, nearMarketContractContextActions.fetchMarketContractValues.isLoading]);

  const onClickOutcomeToken = (outcomeToken: OutcomeToken) => {
    setSelectedOutcomeToken(outcomeToken);
  };

  const onClickCloseCreateMarketModal = () => {
    setIsCreatePriceMarketModalVisible(false);
  };

  const onClickCreateMarketButton = () => {
    // @TODO check if there's a connected wallet, otherwise display the "connect wallet modal"
    setIsCreatePriceMarketModalVisible(true);
  };

  const getCurrentResultElement = () => {
    if (isResolved || (isOver && isResolutionWindowExpired)) {
      return (
        <div className={styles["price-market__current-result-element--create-market"]}>
          <Typography.Description align="right">Create the next price market and earn fees</Typography.Description>
          <Button size="xs" variant="outlined" color="success" onClick={onClickCreateMarketButton}>
            Create Next Price Market
          </Button>
        </div>
      );
    }

    return (
      <>
        <Grid.Row>
          <Grid.Col className={styles["price-market__current-result-element--current-price"]}>
            <Typography.Description>Current price</Typography.Description>
            <Typography.Headline3>{currentPrice}</Typography.Headline3>
          </Grid.Col>
          <Grid.Col className={styles["price-market__current-result-element--time-left"]}>
            <Typography.Description>Time left to bet</Typography.Description>
            <Typography.Headline3
              className={clsx({
                [styles["price-market__current-result-element--time-left-warn"]]: isBettingPeriodEnding(),
              })}
            >
              <Countdown date={buySellTimestamp} />
            </Typography.Headline3>
          </Grid.Col>
        </Grid.Row>
        <Typography.MiniDescription align="center" flat>
          * Bets end {diff} minutes after event starts.
        </Typography.MiniDescription>
      </>
    );
  };

  const getDatesElement = () => {
    if (bettingPeriodExpired()) {
      return (
        <Typography.Description className={styles["price-market__start-end-time--text"]}>
          <span>Betting ended</span> <span>be ready for the next round!</span>
        </Typography.Description>
      );
    }

    return null;
  };

  return (
    <>
      <div className={clsx(styles["price-market"], className)}>
        <Grid.Row>
          <Grid.Col lg={8} xs={12}>
            <Card className={styles["price-market__info-card"]}>
              <Card.Content>
                <MarketCard
                  expanded
                  currentResultElement={getCurrentResultElement()}
                  datesElement={<div className={styles["price-market__dates-element"]}>{getDatesElement()}</div>}
                  onClickOutcomeToken={onClickOutcomeToken}
                  marketContractValues={marketContractValues}
                  onClickResolveMarket={onClickResolveMarket}
                  marketId={marketId}
                />
              </Card.Content>
            </Card>
          </Grid.Col>
          <Grid.Col lg={4} xs={12}>
            {selectedOutcomeToken && (
              <SwapCard
                marketContractValues={marketContractValues}
                selectedOutcomeToken={selectedOutcomeToken}
                setSelectedOutcomeToken={setSelectedOutcomeToken}
                marketId={marketId}
                isBettingEnabled={isBettingEnabled}
              />
            )}
          </Grid.Col>
        </Grid.Row>
      </div>

      {isCreatePriceMarketModalVisible && <CreatePriceMarketModal onClose={onClickCloseCreateMarketModal} />}
    </>
  );
};
