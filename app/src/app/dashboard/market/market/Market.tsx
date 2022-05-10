import clsx from "clsx";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { Grid } from "ui/grid/Grid";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import { Card } from "ui/card/Card";

import styles from "./Market.module.scss";
import { MarketProps } from "./Market.types";

export const Market: React.FC<MarketProps> = ({ className }) => (
  <div className={clsx(styles.market, className)}>
    <MainPanel.Container>
      <Grid.Row>
        <Grid.Col lg={8}>
          <Card>
            <Card.Content>
              <MarketCard expanded />
            </Card.Content>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </MainPanel.Container>
  </div>
);
