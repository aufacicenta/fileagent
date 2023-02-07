import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { Grid } from "ui/grid/Grid";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import { Card } from "ui/card/Card";
import { SwapCardProps } from "ui/pulse/swap-card/SwapCard.types";
import { OutcomeToken } from "providers/near/contracts/market/market.types";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";
import { MarketFeesCard } from "ui/pulse/market-fees-card/MarketFeesCard";

import styles from "./Market.module.scss";
import { MarketProps } from "./Market.types";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

export const Market: React.FC<MarketProps> = ({ className, marketContractValues, marketId }) => {
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<OutcomeToken | undefined>(undefined);

  const { onClickResolveMarket } = useNearMarketContract({ marketId });

  useEffect(() => {
    if (marketContractValues.outcomeTokens) {
      setSelectedOutcomeToken(marketContractValues.outcomeTokens[0]);
    }
  }, [marketContractValues.outcomeTokens]);

  const onClickOutcomeToken = (outcomeToken: OutcomeToken) => {
    setSelectedOutcomeToken(outcomeToken);
  };

  return (
    <div className={clsx(styles.market, className)}>
      <MainPanel.Container>
        <Grid.Row>
          <Grid.Col lg={8} xs={12}>
            <Card className={styles["market__info-card"]}>
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
            <MarketFeesCard />
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
      </MainPanel.Container>
    </div>
  );
};
