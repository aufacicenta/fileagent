import clsx from "clsx";
import dynamic from "next/dynamic";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { Grid } from "ui/grid/Grid";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import { Card } from "ui/card/Card";
import { SwapCardProps } from "ui/pulse/swap-card/SwapCard.types";
import { MarketTransactionsTable } from "ui/pulse/market-transactions-table/MarketTransactionsTable";

import styles from "./Market.module.scss";
import { MarketProps } from "./Market.types";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmitSwapForm = (_values: Record<string, unknown>) => undefined;

export const Market: React.FC<MarketProps> = ({ className }) => (
  <div className={clsx(styles.market, className)}>
    <MainPanel.Container>
      <Grid.Row>
        <Grid.Col lg={8} xs={12}>
          <Card>
            <Card.Content>
              <MarketCard
                expanded
                marketContractValues={{
                  description: "Market description",
                  info: "info",
                  category: "category",
                  options: ["option 1", "option 2"],
                  starts_at: 1656709020000000000,
                  ends_at: 1656709020000000000,
                }}
              />
            </Card.Content>
          </Card>
        </Grid.Col>
        <Grid.Col lg={4} xs={12}>
          <SwapCard onSubmit={onSubmitSwapForm} />
        </Grid.Col>
      </Grid.Row>
      <MarketTransactionsTable />
    </MainPanel.Container>
  </div>
);
