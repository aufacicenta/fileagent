import clsx from "clsx";
import { Form as RFForm } from "react-final-form";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Button } from "ui/button/Button";
import { Card } from "ui/card/Card";
import { Grid } from "ui/grid/Grid";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { Typography } from "ui/typography/Typography";
import { CategoryPills } from "ui/category-pills/CategoryPills";
import pulse from "providers/pulse";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";
import { MarketCardContainer } from "ui/pulse/market-card/MarketCardContainer";
import { useToastContext } from "hooks/useToastContext/useToastContext";

import styles from "./LatestTrends.module.scss";
import { LatestTrendsProps } from "./LatestTrends.types";
import { CreateMarketModalProps } from "./create-market-modal/CreateMarketModal.types";

const CreateMarketModal = dynamic<CreateMarketModalProps>(
  () => import("./create-market-modal/CreateMarketModal").then((mod) => mod.CreateMarketModal),
  { ssr: false },
);

const onApplyFilters = () => undefined;

export const LatestTrends: React.FC<LatestTrendsProps> = ({ className }) => {
  const [isCreateMarketModalVisible, setIsCreateMarketModalVisible] = useState(false);
  const [markets, setMarkets] = useState<Array<string>>([]);

  // @TODO when a create_market transaction succeeds, it returns to this page with this query: http://localhost:3003/?transactionHashes=DCaUjKV84GTSgGkwedb3MbEKxon3fSEzi5hhKjsTAFhW
  // @TODO we need to read the query on router.ready and display a success toast with the tx hash and a link to the tx

  const routes = useRoutes();
  const router = useRouter();
  const toast = useToastContext();

  const { t } = useTranslation(["latest-trends", "common"]);

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
  }, [toast]);

  const onClickCloseCreateMarketModal = () => {
    setIsCreateMarketModalVisible(false);
  };

  const onClickCreateMarketButton = () => {
    // @TODO check if there's a connected wallet, otherwise display the "connect wallet modal"
    setIsCreateMarketModalVisible(true);
  };

  const onClickOutcomeToken = (marketId: string) => {
    router.push(routes.dashboard.market({ marketId }));
  };

  return (
    <>
      <div className={clsx(styles["latest-trends"], className)}>
        <MainPanel.Container>
          <RFForm
            onSubmit={onApplyFilters}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className={styles["latest-trends__filters"]}>
                  <Grid.Row align="center">
                    <Grid.Col lg={6} xs={6}>
                      <Typography.Headline1>{t("latestTrends.title")}</Typography.Headline1>
                    </Grid.Col>
                  </Grid.Row>
                  <div className={styles["latest-trends__filters--desktop"]}>
                    <Grid.Row align="center">
                      <Grid.Col xs={6} offset={{ xs: 6 }}>
                        <div className={styles["latest-trends__filters--actions"]}>
                          <Button color="primary" onClick={onClickCreateMarketButton}>
                            {t("button.createMarket", { ns: "common" })}
                          </Button>
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                  </div>
                </div>
                <Card>
                  <Card.Content>
                    <Grid.Row className={styles["latest-trends__card--actions-row"]}>
                      <Grid.Col lg={6}>.</Grid.Col>
                      <Grid.Col lg={6}>
                        <div className={styles["latest-trends__card--actions"]}>
                          <Button color="primary" onClick={onClickCreateMarketButton}>
                            {t("button.createMarket", { ns: "common" })}
                          </Button>
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                    <CategoryPills>
                      {pulse.getConfig().MARKET_CATEGORIES.map((category) => (
                        <CategoryPills.Pill
                          name="marketCategory"
                          type="radio"
                          id={category.value}
                          label={category.label}
                          key={category.value}
                          icon={
                            <Typography.Text inline flat>
                              {category.icon}
                            </Typography.Text>
                          }
                        />
                      ))}
                    </CategoryPills>
                    <div className={styles["latest-trends__market-cards-grid"]}>
                      <Grid.Row>
                        {markets.map((marketId) => (
                          <Grid.Col lg={4} key={marketId} className={styles["latest-trends__market-cards-grid--col"]}>
                            <MarketCardContainer
                              marketId={marketId}
                              onClickOutcomeToken={() => onClickOutcomeToken(marketId)}
                              onClickMarketTitle={() => onClickOutcomeToken(marketId)}
                            />
                          </Grid.Col>
                        ))}
                      </Grid.Row>
                    </div>
                  </Card.Content>
                </Card>
              </form>
            )}
          />
        </MainPanel.Container>
      </div>

      {isCreateMarketModalVisible && <CreateMarketModal onClose={onClickCloseCreateMarketModal} />}
    </>
  );
};
