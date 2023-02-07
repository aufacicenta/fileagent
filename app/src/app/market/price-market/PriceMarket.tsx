/* eslint-disable @typescript-eslint/naming-convention */
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
import { Button } from "ui/button/Button";
import useNearMarketFactoryContract from "providers/near/contracts/market-factory/useNearMarketFactoryContract";
import { DeployMarketContractArgs } from "providers/near/contracts/market-factory/market-factory.types";
import pulse from "providers/pulse";
import near from "providers/near";
import { DEFAULT_FEE_RATIO } from "providers/near/getConfig";
import { useToastContext } from "hooks/useToastContext/useToastContext";

import { PriceMarketProps } from "./PriceMarket.types";
import styles from "./PriceMarket.module.scss";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

// @TODO markets will be resolved automatically after event ends (server side)
export const PriceMarket: React.FC<PriceMarketProps> = ({ className, marketContractValues, marketId }) => {
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<OutcomeToken | undefined>(undefined);
  const [currentPrice, setCurrentPrice] = useState<string | undefined>(currency.convert.toFormattedString(0));

  const toast = useToastContext();

  const { onClickResolveMarket } = useNearMarketContract({ marketId });
  const MarketFactoryContract = useNearMarketFactoryContract();

  const { market, buySellTimestamp, outcomeTokens, isOver, isResolutionWindowExpired } = marketContractValues;

  const diff = date.client(date.fromNanoseconds(market.ends_at - buySellTimestamp!)).minutes();
  const startsAt = date.client(date.fromNanoseconds(market.starts_at));

  const onClickOutcomeToken = (outcomeToken: OutcomeToken) => {
    setSelectedOutcomeToken(outcomeToken);
  };

  const updateCurrentPrice = async () => {
    const price = await switchboard.fetchCurrentPrice(switchboard.jobs.testnet.near.btcUsd);
    setCurrentPrice(currency.convert.toFormattedString(price));
  };

  const onClickCreatePriceMarket = async () => {
    try {
      const timezoneOffset = 0;

      const starts_at = date.now().utcOffset(timezoneOffset);
      const ends_at = starts_at.clone().add(30, "minutes");

      const dao_account_id = near.getConfig().marketDaoAccountId;

      const collateralToken = pulse.getConfig().COLLATERAL_TOKENS[0];

      const resolutionWindow = ends_at.clone().add(5, "minutes");

      // @TODO set to the corresponding Switchboard aggregator feed address
      const ix = {
        address: [
          173, 62, 255, 125, 45, 251, 162, 167, 128, 129, 25, 33, 146, 248, 118, 134, 118, 192, 215, 84, 225, 222, 198,
          48, 70, 49, 212, 195, 84, 136, 96, 56,
        ],
      };

      const current_price = (await switchboard.fetchCurrentPrice(switchboard.jobs.testnet.near.btcUsd)).toFixed(2);

      const args: DeployMarketContractArgs = {
        market: {
          description: "",
          info: "",
          category: "crypto",
          options: ["yes", "no"],
          starts_at: date.toNanoseconds(starts_at.valueOf()),
          ends_at: date.toNanoseconds(ends_at.valueOf()),
          utc_offset: timezoneOffset,
        },
        collateral_token: {
          id: collateralToken.accountId,
          decimals: collateralToken.decimals,
          balance: 0,
          fee_balance: 0,
        },
        fees: {
          // 2% of 6 precision decimals
          fee_ratio: DEFAULT_FEE_RATIO,
        },
        resolution: {
          window: date.toNanoseconds(resolutionWindow.valueOf()),
          ix,
        },
        management: {
          dao_account_id,
        },
        price: {
          value: Number(current_price),
          base_currency_symbol: "BTC",
          target_currency_symbol: "USD",
        },
      };

      await MarketFactoryContract.createMarket(args);
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        title: "Oops, our bad.",
        children: <Typography.Text>While creating the market. Try again?</Typography.Text>,
      });
    }
  };

  useEffect(() => {
    if (outcomeTokens) {
      setSelectedOutcomeToken(outcomeTokens[0]);
    }
  }, [outcomeTokens]);

  useEffect(() => {
    const interval = setInterval(async () => {
      updateCurrentPrice();
    }, 5000);

    if (date.now().valueOf() > startsAt.clone().add(diff, "minutes").valueOf()) {
      updateCurrentPrice();
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getCurrentResultElement = () => {
    if (isOver && isResolutionWindowExpired) {
      return (
        <div className={styles["price-market__current-result-element--create-market"]}>
          <Typography.Description align="right">Create the next price market and earn fees</Typography.Description>
          <Button size="xs" variant="outlined" color="success" onClick={onClickCreatePriceMarket}>
            Create Next Market
          </Button>
        </div>
      );
    }

    return (
      <>
        <Typography.Description align="right">Current Price</Typography.Description>
        <Typography.Headline3 align="right" flat>
          {currentPrice}
        </Typography.Headline3>
      </>
    );
  };

  const getDatesElement = () => {
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
            />
          )}
        </Grid.Col>
      </Grid.Row>
    </div>
  );
};
