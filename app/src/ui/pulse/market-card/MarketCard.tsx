import clsx from "clsx";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { HorizontalLine } from "ui/horizontal-line/HorizontalLine";
import { Button } from "ui/button/Button";
import { Grid } from "ui/grid/Grid";
import date from "providers/date";
import pulse from "providers/pulse";
import currency from "providers/currency";

import { MarketCardProps } from "./MarketCard.types";
import styles from "./MarketCard.module.scss";

// @TODO i18n
export const MarketCard: React.FC<MarketCardProps> = ({
  className,
  expanded,
  marketContractValues: { market, resolutionWindow, isPublished, outcomeTokens, collateralTokenMetadata },
  onClickPublishMarket,
  onClickOutcomeToken,
}) => {
  const getMarketOptions = () =>
    market.options.map((option, id) => {
      if (!isPublished && outcomeTokens?.length === 0) {
        return (
          <Button
            color="secondary"
            fullWidth
            className={styles["market-card__market-options--actions-button"]}
            key={option}
            disabled
          >
            <span
              className={styles["market-card__market-options--actions-button-dot"]}
              style={{ backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id] }}
            />{" "}
            {option}{" "}
            <span className={styles["market-card__market-options--actions-button-percentage"]}>
              {Number(100 / market.options.length)
                .toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION)
                .toString()}
              %
            </span>
          </Button>
        );
      }

      const outcomeToken = outcomeTokens![id];

      return (
        <Button
          color="secondary"
          fullWidth
          className={styles["market-card__market-options--actions-button"]}
          key={option}
          onClick={() => onClickOutcomeToken(outcomeToken)}
        >
          <span
            className={styles["market-card__market-options--actions-button-dot"]}
            style={{ backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id] }}
          />{" "}
          {option}{" "}
          <span className={styles["market-card__market-options--actions-button-percentage"]}>
            {outcomeToken.price * 100}%
          </span>
        </Button>
      );
    });

  const getMarketOptionsProgress = () =>
    market.options.map((option, id) => {
      if (!isPublished && outcomeTokens?.length === 0) {
        return (
          <div
            className={styles["market-card__market-options--progres-bar-width"]}
            style={{
              width: `${100 / market.options.length}%`,
              backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id],
            }}
            key={option}
          />
        );
      }

      const outcomeToken = outcomeTokens![id];

      return (
        <div
          className={styles["market-card__market-options--progres-bar-width"]}
          style={{ width: `${outcomeToken.price * 100}%`, backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id] }}
          key={option}
        />
      );
    });

  return (
    <Card className={clsx(styles["market-card"], className)}>
      <Card.Content>
        {!expanded && (
          <div
            className={styles["market-card__image"]}
            style={{ backgroundImage: `url(/shared/market-card-img.jpg)` }}
          />
        )}
        <Grid.Row>
          <Grid.Col lg={expanded ? 7 : 12}>
            <Typography.Text
              className={clsx(styles["market-card__title"], className, {
                [styles["market-card__title--expanded"]]: expanded,
              })}
            >
              {market.description}
            </Typography.Text>
            <HorizontalLine />
            <div className={styles["market-card__start-end-time"]}>
              <Typography.Description className={styles["market-card__start-end-time--text"]}>
                <span>Market starts</span>{" "}
                <span>{date.fromTimestampWithOffset(market.starts_at, market.utc_offset)}</span>
              </Typography.Description>
              <Typography.Description className={styles["market-card__start-end-time--text"]}>
                <span>Market ends</span> <span>{date.fromTimestampWithOffset(market.ends_at, market.utc_offset)}</span>
              </Typography.Description>
              <Typography.Description className={styles["market-card__start-end-time--text"]}>
                <span>Resolution date</span>{" "}
                <span>{date.fromTimestampWithOffset(resolutionWindow, market.utc_offset)}</span>
              </Typography.Description>
            </div>
          </Grid.Col>
          <Grid.Col lg={expanded ? 5 : 12}>
            <Card className={styles["market-card__market-options"]}>
              <Card.Content className={styles["market-card__market-options--card-content"]}>
                {isPublished && (
                  <>
                    <Typography.Headline5 className={clsx(styles["market-card__market-options--title"])}>
                      What does the market think?
                    </Typography.Headline5>
                    <div className={styles["market-card__market-options--progres-bar"]}>
                      {getMarketOptionsProgress()}
                    </div>
                  </>
                )}
                <div className={styles["market-card__market-options--actions"]}>
                  {!isPublished && (
                    <Button
                      color="primary"
                      fullWidth
                      className={styles["market-card__market-options--actions-button"]}
                      onClick={onClickPublishMarket}
                    >
                      Publish Market
                    </Button>
                  )}
                  {getMarketOptions()}
                </div>
                <div className={styles["market-card__market-options--stats"]}>
                  <Typography.Description className={styles["market-card__market-options--stats-stat"]} flat>
                    <span>Liquidity:</span>
                    <span>
                      {collateralTokenMetadata.balance}{" "}
                      {pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id).symbol}
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
