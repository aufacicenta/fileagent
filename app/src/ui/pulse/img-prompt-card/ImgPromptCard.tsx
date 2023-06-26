import clsx from "clsx";
import Countdown from "react-countdown";

import { Card } from "ui/card/Card";
import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import near from "providers/near";
import date from "providers/date";

import { ImgPromptCardProps } from "./ImgPromptCard.types";
import styles from "./ImgPromptCard.module.scss";

export const ImgPromptCard: React.FC<ImgPromptCardProps> = ({
  marketId,
  marketContractValues,
  className,
  datesElement,
}) => {
  const { market, resolutionWindow, buySellTimestamp, resolution } = marketContractValues;

  const marketClosesIn = date.client(market.ends_at - buySellTimestamp!).minutes();

  const getDatesElement = () => {
    if (!datesElement) {
      return (
        <>
          <Typography.Description className={styles["img-prompt-card__start-end-time--text"]}>
            <span>Event starts</span>
            <span>{date.fromTimestampWithOffset(market.starts_at, market.utc_offset)}</span>
          </Typography.Description>
          <Typography.Description className={styles["img-prompt-card__start-end-time--text"]}>
            <span>Event ends</span> <span>{date.fromTimestampWithOffset(market.ends_at, market.utc_offset)}</span>
          </Typography.Description>
          <Typography.MiniDescription align="right">
            *market closes {marketClosesIn} minutes <strong>after event starts</strong>.
          </Typography.MiniDescription>
          <Typography.Description flat={!resolutionWindow} className={styles["img-prompt-card__start-end-time--text"]}>
            <span>Resolution date</span>
            <span>{resolutionWindow ? date.fromTimestampWithOffset(resolutionWindow, market.utc_offset) : "TBD*"}</span>
          </Typography.Description>
          {!resolutionWindow && (
            <Typography.MiniDescription align="right">
              *when event ends and DAO proposals are published.
            </Typography.MiniDescription>
          )}
        </>
      );
    }

    return datesElement;
  };

  return (
    <Card className={clsx(styles["img-prompt-card"], className)} withSpotlightEffect>
      <Card.Content>
        <Grid.Row>
          <Grid.Col lg={7}>
            <Card withSpotlightEffect>
              <Card.Content className={styles["img-prompt-card__current-img-card--box"]}>
                <div className={styles["img-prompt-card__current-img-card--file"]}>
                  <img src="/prompt-wars/toast.jpg" alt="current" />
                </div>
              </Card.Content>
            </Card>
          </Grid.Col>
          <Grid.Col lg={5}>
            <div className={styles["img-prompt-card__right-column"]}>
              <Card className={styles["img-prompt-card__countdown"]}>
                <Card.Content className={styles["img-prompt-card__countdown--content"]}>
                  <Typography.Description>Time left</Typography.Description>
                  <Typography.Headline3 flat>
                    <Countdown date={Date.now() - 1000000} />
                  </Typography.Headline3>
                  <Typography.MiniDescription flat>
                    Next image will load in <Countdown date={Date.now() - 1000000} />
                  </Typography.MiniDescription>
                </Card.Content>
              </Card>
              <div className={styles["img-prompt-card__start-end-time"]}>
                {getDatesElement()}

                <Card className={styles["img-prompt-card__stats"]} withSpotlightEffect>
                  <Card.Content className={styles["img-prompt-card__stats--content"]}>
                    <Typography.Description>Participants</Typography.Description>
                    <Typography.Text>12,345</Typography.Text>
                    <Typography.Description>Total Price Bag</Typography.Description>
                    <Typography.Text flat>USDT 34,500.00</Typography.Text>
                  </Card.Content>
                </Card>

                <div className={styles["img-prompt-card__start-end-time--resolution"]}>
                  <Typography.Description flat>Contract</Typography.Description>
                  <Typography.Anchor
                    href={`${near.getConfig().explorerUrl}/accounts/${marketId}`}
                    target="_blank"
                    truncate
                  >
                    {marketId}
                    <Icon name="icon-launch" />
                  </Typography.Anchor>
                </div>
              </div>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Card.Content>
    </Card>
  );
};
