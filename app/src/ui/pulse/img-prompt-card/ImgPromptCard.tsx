import clsx from "clsx";
import Countdown from "react-countdown";

import { Card } from "ui/card/Card";
import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import near from "providers/near";

import { ImgPromptCardProps } from "./ImgPromptCard.types";
import styles from "./ImgPromptCard.module.scss";

export const ImgPromptCard: React.FC<ImgPromptCardProps> = ({
  marketId,
  marketContractValues,
  className,
  datesElement,
}) => {
  const { market, resolution, outcomeIds } = marketContractValues;

  const nextImageLoadTime = resolution.window;

  const getDatesElement = () => datesElement;

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
                    <Countdown date={market.ends_at} />
                  </Typography.Headline3>
                  <Typography.MiniDescription flat>
                    Next image will load in <Countdown date={nextImageLoadTime} />
                  </Typography.MiniDescription>
                </Card.Content>
              </Card>
              <div className={styles["img-prompt-card__start-end-time"]}>
                {getDatesElement()}

                <Card className={styles["img-prompt-card__stats"]} withSpotlightEffect>
                  <Card.Content className={styles["img-prompt-card__stats--content"]}>
                    <Typography.Description>Status</Typography.Description>
                    {/* Open for submissions, revealing, resolving, claim fees, destroy */}
                    <Typography.Text>Open for submissions</Typography.Text>
                    <Typography.Description>Participants</Typography.Description>
                    <Typography.Text>{outcomeIds.length}</Typography.Text>
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
