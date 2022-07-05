import clsx from "clsx";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { HorizontalLine } from "ui/horizontal-line/HorizontalLine";
import { Button } from "ui/button/Button";
import { Grid } from "ui/grid/Grid";

import { MarketCardProps } from "./MarketCard.types";
import styles from "./MarketCard.module.scss";

export const MarketCardTemplate: React.FC<
  Omit<MarketCardProps, "marketContractValues" | "onClickPublishMarket" | "onClickOutcomeToken">
> = ({ className, expanded }) => (
  <Card className={clsx(styles["market-card"], className)}>
    <Card.Content>
      {!expanded && (
        <div className={styles["market-card__image"]} style={{ backgroundImage: `url(/shared/market-card-img.jpg)` }} />
      )}
      <Grid.Row>
        <Grid.Col lg={expanded ? 7 : 12}>
          <Typography.Text
            className={clsx(styles["market-card__title"], className, {
              [styles["market-card__title--expanded"]]: expanded,
            })}
          >
            Loading...
          </Typography.Text>
          <HorizontalLine />
          <div className={styles["market-card__start-end-time"]}>
            <Typography.Description>Market starts - loading...</Typography.Description>
            <Typography.Description>Market ends - loading...</Typography.Description>
            <Typography.Description>Resolution date - loading...</Typography.Description>
          </div>
        </Grid.Col>
        <Grid.Col lg={expanded ? 5 : 12}>
          <Card className={styles["market-card__market-options"]}>
            <Card.Content className={styles["market-card__market-options--card-content"]}>
              <Typography.Headline5 className={clsx(styles["market-card__market-options--title"])}>
                What does the market think?
              </Typography.Headline5>
              <div className={styles["market-card__market-options--progres-bar"]}>
                <div
                  className={styles["market-card__market-options--progres-bar-width"]}
                  style={{ width: "80%", backgroundColor: "#FC59FF" }}
                />
                <div
                  className={styles["market-card__market-options--progres-bar-width"]}
                  style={{ width: "20%", backgroundColor: "#5356FC" }}
                />
              </div>
              <div className={styles["market-card__market-options--actions"]}>
                <Button color="secondary" fullWidth className={styles["market-card__market-options--actions-button"]}>
                  <span
                    className={styles["market-card__market-options--actions-button-dot"]}
                    style={{ backgroundColor: "#FC59FF" }}
                  />{" "}
                  Yes <span className={styles["market-card__market-options--actions-button-percentage"]}>80%</span>
                </Button>
                <Button color="secondary" fullWidth className={styles["market-card__market-options--actions-button"]}>
                  <span
                    className={styles["market-card__market-options--actions-button-dot"]}
                    style={{ backgroundColor: "#5356FC" }}
                  />{" "}
                  No <span className={styles["market-card__market-options--actions-button-percentage"]}>20%</span>
                </Button>
              </div>
              <div className={styles["market-card__market-options--stats"]}>
                <Typography.Description className={styles["market-card__market-options--stats-stat"]} flat>
                  <span>Liquidity:</span>
                  <span>loading...</span>
                </Typography.Description>
                <Typography.Description className={styles["market-card__market-options--stats-stat"]} flat>
                  <span>Total Volume:</span>
                  <span>loading...</span>
                </Typography.Description>
              </div>
            </Card.Content>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </Card.Content>
  </Card>
);
