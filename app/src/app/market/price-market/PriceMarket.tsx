import clsx from "clsx";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Grid } from "ui/grid/Grid";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import { Card } from "ui/card/Card";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";
import { OutcomeToken } from "providers/near/contracts/market/market.types";
import { SwapCardProps } from "ui/pulse/swap-card/SwapCard.types";
import switchboard from "providers/switchboard";
import currency from "providers/currency";
import { Typography } from "ui/typography/Typography";
import date from "providers/date";

import styles from "./PriceMarket.module.scss";
import { PriceMarketProps } from "./PriceMarket.types";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

export const PriceMarket: React.FC<PriceMarketProps> = ({ className, marketContractValues, marketId }) => {
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<OutcomeToken | undefined>(undefined);
  const [currentPrice, setCurrentPrice] = useState<string | undefined>(currency.convert.toFormattedString(0));

  const { onClickResolveMarket } = useNearMarketContract({ marketId });

  const { market, buySellTimestamp, outcomeTokens } = marketContractValues;

  const onClickOutcomeToken = (outcomeToken: OutcomeToken) => {
    setSelectedOutcomeToken(outcomeToken);
  };

  useEffect(() => {
    if (outcomeTokens) {
      setSelectedOutcomeToken(outcomeTokens[0]);
    }
  }, [outcomeTokens]);

  useEffect(() => {
    // (async () => {
    // })();
    const interval = setInterval(async () => {
      const price = await switchboard.fetchCurrentPrice(switchboard.jobs.testnet.near.btcUsd);
      setCurrentPrice(currency.convert.toFormattedString(price));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [outcomeTokens]);

  const getDatesElement = () => {
    const diff = date.client(date.fromNanoseconds(market.ends_at - buySellTimestamp!)).minutes();
    const startsAt = date.client(date.fromNanoseconds(market.starts_at));

    if (date.now().valueOf() > startsAt.clone().add(diff, "minutes").valueOf()) {
      return (
        <>
          <Typography.Description className={styles["price-market__start-end-time--text"]}>
            <span>Betting ended</span> <span>be ready for the next round!</span>
          </Typography.Description>
          <Typography.MiniDescription align="right">
            * Bets end {diff} minutes after market opens.
          </Typography.MiniDescription>
        </>
      );
    }

    const minutes = startsAt.clone().add(diff, "minutes").diff(date.now(), "minutes");
    const seconds = startsAt.clone().add(diff, "minutes").diff(date.now(), "seconds");
    const marketClosesIn = `in ${minutes} minutes, ${seconds} seconds`;

    return (
      <Typography.Description className={styles["price-market__start-end-time--text"]}>
        <span>Betting ends</span> <span>{marketClosesIn}</span>
      </Typography.Description>
    );
  };

  return (
    <div className={clsx(styles["price-market"], className)}>
      <Grid.Row>
        <Grid.Col lg={8} xs={12}>
          <Card className={styles["price-market__info-card"]}>
            <Card.Content>
              <MarketCard
                expanded
                currentResultElement={
                  <>
                    <Typography.Description align="right">Current Price</Typography.Description>
                    <Typography.Headline3 align="right" flat>
                      {currentPrice}
                    </Typography.Headline3>
                  </>
                }
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
            />
          )}
        </Grid.Col>
      </Grid.Row>
    </div>
  );
};
