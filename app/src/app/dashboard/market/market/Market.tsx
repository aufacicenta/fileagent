import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { Grid } from "ui/grid/Grid";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import { Card } from "ui/card/Card";
import { SwapCardProps } from "ui/pulse/swap-card/SwapCard.types";
import { MarketTransactionsTable } from "ui/pulse/market-transactions-table/MarketTransactionsTable";
import { OutcomeToken } from "providers/near/contracts/market/market.types";

import styles from "./Market.module.scss";
import { MarketProps } from "./Market.types";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmitSwapForm = (_values: Record<string, unknown>) => undefined;

export const Market: React.FC<MarketProps> = ({ className, marketContractValues }) => {
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<OutcomeToken | undefined>(undefined);

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
            <Card>
              <Card.Content>
                <MarketCard
                  expanded
                  onClickPublishMarket={() => undefined}
                  onClickOutcomeToken={onClickOutcomeToken}
                  marketContractValues={marketContractValues}
                />
              </Card.Content>
            </Card>
          </Grid.Col>
          <Grid.Col lg={4} xs={12}>
            {selectedOutcomeToken && (
              <SwapCard
                onSubmit={onSubmitSwapForm}
                marketContractValues={marketContractValues}
                selectedOutcomeToken={selectedOutcomeToken}
              />
            )}
          </Grid.Col>
        </Grid.Row>
        <MarketTransactionsTable />
      </MainPanel.Container>
    </div>
  );
};
