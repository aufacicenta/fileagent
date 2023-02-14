import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import dynamic from "next/dynamic";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { Typography } from "ui/typography/Typography";
import { PriceMarket } from "app/market/price-market/PriceMarket";
import { Button } from "ui/button/Button";
import { CreatePriceMarketModalProps } from "app/market/price-market/create-price-market-modal/CreatePriceMarketModal.types";
import { NearMarketContractContextController } from "context/near/market-contract/NearMarketContractContextController";

import { HomeProps } from "./Home.types";
import styles from "./Home.module.scss";
import { LatestPriceMarketsTableContainer } from "./latest-price-markets-table/LatestPriceMarketsTableContainer";

const CreatePriceMarketModal = dynamic<CreatePriceMarketModalProps>(
  () =>
    import("app/market/price-market/create-price-market-modal/CreatePriceMarketModal").then(
      (mod) => mod.CreatePriceMarketModal,
    ),
  { ssr: false },
);

export const Home: React.FC<HomeProps> = ({ className, marketId }) => {
  const [isCreatePriceMarketModalVisible, setIsCreatePriceMarketModalVisible] = useState(false);

  const { t } = useTranslation(["home", "common"]);

  const onClickCloseCreateMarketModal = () => {
    setIsCreatePriceMarketModalVisible(false);
  };

  const onClickCreateMarketButton = () => {
    // @TODO check if there's a connected wallet, otherwise display the "connect wallet modal"
    setIsCreatePriceMarketModalVisible(true);
  };

  return (
    <>
      <div className={clsx(styles.home, className)}>
        <MainPanel.Container>
          <div className={styles["home__title-row"]}>
            <Typography.Headline1 className={styles.home__title}>{t("home.title")}</Typography.Headline1>
            <div className={styles["home__actions-row"]}>
              <div>
                <Button variant="outlined" color="secondary" size="xs">
                  See All
                </Button>
              </div>
              <div>
                <Button variant="outlined" color="secondary" size="xs" onClick={onClickCreateMarketButton}>
                  Create Price Market
                </Button>
              </div>
            </div>
          </div>

          <NearMarketContractContextController marketId={marketId}>
            <PriceMarket marketId={marketId} />
          </NearMarketContractContextController>

          <div className={styles["home__latest-price-markets-table"]}>
            <LatestPriceMarketsTableContainer />
          </div>
        </MainPanel.Container>
      </div>

      {isCreatePriceMarketModalVisible && <CreatePriceMarketModal onClose={onClickCloseCreateMarketModal} />}
    </>
  );
};
