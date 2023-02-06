import clsx from "clsx";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { HorizontalLine } from "ui/horizontal-line/HorizontalLine";
import { Button } from "ui/button/Button";
import { Grid } from "ui/grid/Grid";
import date from "providers/date";
import near from "providers/near";
import { Icon } from "ui/icon/Icon";
import pulse from "providers/pulse";

import { MarketCardProps } from "./MarketCard.types";
import styles from "./MarketCard.module.scss";
import { MarketOptions } from "./market-options/MarketOptions";
import { MarketOptionsProgress } from "./market-options-progress/MarketOptionsProgress";
import { CollateralTokenBalance } from "./collateral-token-balance/CollateralTokenBalance";

const getRandomImage = () => {
  const num = Math.floor(Math.random() * (23 - 1) + 1);

  return `url(/market/abstract/abstract${num}.png)`;
};

// @TODO i18n
export const MarketCard: React.FC<MarketCardProps> = ({
  className,
  expanded,
  marketContractValues,
  marketId,
  onClickResolveMarket,
  onClickOutcomeToken,
  onClickMarketTitle,
}) => {
  const { market, resolutionWindow, isOver, collateralTokenMetadata, buySellTimestamp, isResolved, resolution } =
    marketContractValues;

  const marketClosesIn = date.client(date.fromNanoseconds(market.ends_at - buySellTimestamp!)).minutes();

  return (
    <Card className={clsx(styles["market-card"], className)}>
      <Card.Content>
        {!expanded && <div className={styles["market-card__image"]} style={{ backgroundImage: getRandomImage() }} />}
        <Grid.Row>
          <Grid.Col lg={expanded ? 7 : 12}>
            <Typography.Text
              className={clsx(styles["market-card__title"], className, {
                [styles["market-card__title--expanded"]]: expanded,
                [styles["market-card__title--hover"]]: !!onClickMarketTitle,
              })}
              onClick={onClickMarketTitle}
            >
              {market.description}
            </Typography.Text>
            <HorizontalLine />
            <div className={styles["market-card__start-end-time"]}>
              <Typography.Description className={styles["market-card__start-end-time--text"]}>
                <span>Event starts</span>
                <span>{date.fromTimestampWithOffset(market.starts_at, market.utc_offset)}</span>
              </Typography.Description>
              <Typography.Description className={styles["market-card__start-end-time--text"]}>
                <span>Event ends</span> <span>{date.fromTimestampWithOffset(market.ends_at, market.utc_offset)}</span>
              </Typography.Description>
              <Typography.MiniDescription align="right">
                *market closes {marketClosesIn} minutes <strong>after event starts</strong>.
              </Typography.MiniDescription>
              <Typography.Description flat={!resolutionWindow} className={styles["market-card__start-end-time--text"]}>
                <span>Resolution date</span>
                <span>
                  {resolutionWindow ? date.fromTimestampWithOffset(resolutionWindow, market.utc_offset) : "TBD*"}
                </span>
              </Typography.Description>
              {!resolutionWindow && (
                <Typography.MiniDescription align="right">
                  *when event ends and DAO proposals are published.
                </Typography.MiniDescription>
              )}
              <Typography.Description className={styles["market-card__start-end-time--text"]}>
                <span>Resolution mechanism</span>
                {/* @TODO update to Switchboard feed URL */}
                <Typography.Anchor
                  href={`${pulse.getConfig().resolutionMechanism.baseUrl}/${resolution.feedId}`}
                  target="_blank"
                  truncate
                >
                  {resolution.feedId}
                  <Icon name="icon-launch" />
                </Typography.Anchor>
              </Typography.Description>
              <Typography.Description className={styles["market-card__start-end-time--text"]}>
                <span>Contract</span>
                <Typography.Anchor
                  href={`${near.getConfig().explorerUrl}/accounts/${marketId}`}
                  target="_blank"
                  truncate
                >
                  {marketId}
                  <Icon name="icon-launch" />
                </Typography.Anchor>
              </Typography.Description>
            </div>
          </Grid.Col>
          <Grid.Col lg={expanded ? 5 : 12}>
            <Card className={styles["market-card__market-options"]}>
              <Card.Content className={styles["market-card__market-options--card-content"]}>
                <>
                  <Typography.Headline5 className={clsx(styles["market-card__market-options--title"])}>
                    What does the market think?
                  </Typography.Headline5>
                  <div className={styles["market-card__market-options--progres-bar"]}>
                    <MarketOptionsProgress marketContractValues={marketContractValues} />
                  </div>
                </>
                <div className={styles["market-card__market-options--actions"]}>
                  {isOver && !isResolved && !expanded && (
                    <Button
                      color="primary"
                      fullWidth
                      className={styles["market-card__market-options--actions-button"]}
                      onClick={onClickResolveMarket}
                    >
                      Submit to Resolution
                    </Button>
                  )}
                  <MarketOptions
                    onClickOutcomeToken={onClickOutcomeToken}
                    marketContractValues={marketContractValues}
                  />
                </div>
                <div className={styles["market-card__market-options--stats"]}>
                  <Typography.Description className={styles["market-card__market-options--stats-stat"]} flat>
                    <span>Total Value Locked:</span>
                    <span>
                      <CollateralTokenBalance collateralTokenMetadata={collateralTokenMetadata} marketId={marketId} />
                    </span>
                  </Typography.Description>
                </div>
              </Card.Content>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Card.Content>
    </Card>
  );
};
