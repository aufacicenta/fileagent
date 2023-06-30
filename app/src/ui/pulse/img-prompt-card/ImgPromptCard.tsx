import clsx from "clsx";
import Countdown from "react-countdown";

import { Card } from "ui/card/Card";
import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import near from "providers/near";
import currency from "providers/currency";
import { PromptWarsMarketContractStatus } from "providers/near/contracts/prompt-wars/prompt-wars.types";
import ipfs from "providers/ipfs";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";

import { ImgPromptCardProps } from "./ImgPromptCard.types";
import styles from "./ImgPromptCard.module.scss";

export const ImgPromptCard: React.FC<ImgPromptCardProps> = ({
  marketId,
  marketContractValues,
  className,
  datesElement,
  onClaimDepositUnresolved,
  onRevealWatchProgressClick,
}) => {
  const walletState = useWalletStateContext();

  const { market, resolution, outcomeIds, collateralToken, status } = marketContractValues;

  const nextImageLoadTime = resolution.window;

  const getDatesElement = () => datesElement;

  const getStatusElement = () => {
    if (status === PromptWarsMarketContractStatus.REVEALING) {
      return (
        <>
          <Typography.Text flat>{status}</Typography.Text>
          <Typography.MiniDescription onClick={onRevealWatchProgressClick}>Watch progress</Typography.MiniDescription>
        </>
      );
    }

    if (status === PromptWarsMarketContractStatus.RESOLVING) {
      return (
        <>
          <Typography.Text flat>{status}</Typography.Text>
          <Typography.MiniDescription>
            <Countdown date={resolution.window} />
          </Typography.MiniDescription>
        </>
      );
    }

    if (status === PromptWarsMarketContractStatus.RESOLVED) {
      return (
        <>
          <Typography.Text flat>{status}</Typography.Text>
          <Typography.MiniDescription>Claim your earnings! (If you won 😅)</Typography.MiniDescription>
        </>
      );
    }

    if (status === PromptWarsMarketContractStatus.UNRESOLVED) {
      return (
        <>
          <Typography.Text flat>{status}</Typography.Text>
          <Typography.MiniDescription onClick={onClaimDepositUnresolved}>
            Claim back your deposit
          </Typography.MiniDescription>
        </>
      );
    }

    return <Typography.Text>{status}</Typography.Text>;
  };

  return (
    <Card className={clsx(styles["img-prompt-card"], className)} withSpotlightEffect>
      <Card.Content>
        <Grid.Row>
          <Grid.Col lg={7}>
            <Card withSpotlightEffect>
              <Card.Content className={styles["img-prompt-card__current-img-card--box"]}>
                <div className={styles["img-prompt-card__current-img-card--file"]}>
                  <img src={ipfs.asHttpsURL(market.image_uri)} alt="current" />
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
                  {![PromptWarsMarketContractStatus.OPEN, PromptWarsMarketContractStatus.LOADING].includes(status) && (
                    <Typography.MiniDescription flat>
                      Next image will load in <Countdown date={nextImageLoadTime} />
                    </Typography.MiniDescription>
                  )}
                </Card.Content>
              </Card>
              <div className={styles["img-prompt-card__start-end-time"]}>
                {getDatesElement()}

                <Card className={styles["img-prompt-card__stats"]} withSpotlightEffect>
                  <Card.Content className={styles["img-prompt-card__stats--content"]}>
                    <Typography.Description>Status</Typography.Description>
                    {getStatusElement()}
                    <Typography.Description>Participants</Typography.Description>
                    <Typography.Text flat={outcomeIds.includes(walletState.address as string)}>
                      {outcomeIds.length}
                    </Typography.Text>
                    <Typography.MiniDescription>
                      {outcomeIds.includes(walletState.address as string) ? "You're in!" : null}
                    </Typography.MiniDescription>
                    <Typography.Description>Total Price Bag</Typography.Description>
                    <Typography.Text flat>
                      USDT{" "}
                      {currency.convert.toDecimalsPrecisionString(collateralToken.balance, collateralToken.decimals)}
                    </Typography.Text>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Card.Content>
      <Card.Actions>
        <div className={styles["img-prompt-card__start-end-time--resolution"]}>
          <Typography.Description flat>Contract</Typography.Description>
          <Typography.Anchor href={`${near.getConfig().explorerUrl}/accounts/${marketId}`} target="_blank">
            {marketId} <Icon name="icon-launch" />
          </Typography.Anchor>
        </div>
      </Card.Actions>
    </Card>
  );
};
