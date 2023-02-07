import clsx from "clsx";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Grid } from "ui/grid/Grid";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import { Card } from "ui/card/Card";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";
import { OutcomeToken } from "providers/near/contracts/market/market.types";
import { SwapCardProps } from "ui/pulse/swap-card/SwapCard.types";

import styles from "./PriceMarket.module.scss";
import { PriceMarketProps } from "./PriceMarket.types";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

export const PriceMarket: React.FC<PriceMarketProps> = ({ className, marketContractValues, marketId }) => {
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<OutcomeToken | undefined>(undefined);
  const { onClickResolveMarket } = useNearMarketContract({ marketId });

  const onClickOutcomeToken = (outcomeToken: OutcomeToken) => {
    setSelectedOutcomeToken(outcomeToken);
  };

  useEffect(() => {
    if (marketContractValues.outcomeTokens) {
      setSelectedOutcomeToken(marketContractValues.outcomeTokens[0]);
    }
  }, [marketContractValues.outcomeTokens]);

  return (
    <div className={clsx(styles["price-market"], className)}>
      <Grid.Row>
        <Grid.Col lg={8} xs={12}>
          <Card className={styles["price-market__info-card"]}>
            <Card.Content>
              <MarketCard
                expanded
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
