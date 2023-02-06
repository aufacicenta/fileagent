import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { MarketCard } from "ui/pulse/market-card/MarketCard";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";
import { OutcomeToken } from "providers/near/contracts/market/market.types";
import { SwapCardProps } from "ui/pulse/swap-card/SwapCard.types";
import { MarketFeesCard } from "ui/pulse/market-fees-card/MarketFeesCard";

import { HomeProps } from "./Home.types";
import styles from "./Home.module.scss";

const SwapCard = dynamic<SwapCardProps>(() => import("ui/pulse/swap-card/SwapCard").then((mod) => mod.SwapCard), {
  ssr: false,
});

export const Home: React.FC<HomeProps> = ({ className, marketId, marketContractValues }) => {
  const [, setMarkets] = useState<Array<string>>([]);
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<OutcomeToken | undefined>(undefined);

  const toast = useToastContext();

  const { t } = useTranslation(["home", "common"]);

  const { onClickResolveMarket } = useNearMarketContract({ marketId });

  const onClickOutcomeToken = (outcomeToken: OutcomeToken) => {
    setSelectedOutcomeToken(outcomeToken);
  };

  useEffect(() => {
    (async () => {
      try {
        const marketFactory = await MarketFactoryContract.loadFromGuestConnection();
        // @TODO use pagination method get_markets
        const marketsList = await marketFactory.getMarketsList();

        if (!marketsList) {
          throw new Error("Failed to fetch markets");
        }

        setMarkets(marketsList?.reverse());
      } catch {
        toast.trigger({
          variant: "error",
          withTimeout: true,
          // @TODO i18n
          title: "Failed to fetch recent markets",
          children: <Typography.Text>Try refreshing the page, or check your internet connection.</Typography.Text>,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (marketContractValues.outcomeTokens) {
      setSelectedOutcomeToken(marketContractValues.outcomeTokens[0]);
    }
  }, [marketContractValues.outcomeTokens]);

  return (
    <div className={clsx(styles.home, className)}>
      <MainPanel.Container>
        <div className={styles["home__title-row"]}>
          <Typography.Headline1>{t("home.title")}</Typography.Headline1>
        </div>
        <Grid.Row>
          <Grid.Col lg={8} xs={12}>
            <Card className={styles["home__info-card"]}>
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
