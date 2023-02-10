import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { Typography } from "ui/typography/Typography";
import { PriceMarket } from "app/market/price-market/PriceMarket";
import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";
import { GenericLoader } from "ui/generic-loader/GenericLoader";

import { HomeProps } from "./Home.types";
import styles from "./Home.module.scss";

export const Home: React.FC<HomeProps> = ({ className, marketId }) => {
  const { t } = useTranslation(["home", "common"]);

  const { marketContractValues, fetchMarketContractValues } = useNearMarketContractContext();

  useEffect(() => {
    fetchMarketContractValues();
  }, [marketId]);

  return (
    <div className={clsx(styles.home, className)}>
      <MainPanel.Container>
        <div className={styles["home__title-row"]}>
          <Typography.Headline1 className={styles.home__title}>{t("home.title")}</Typography.Headline1>
        </div>
        {!marketContractValues ? (
          // @TODO render PriceMarket skeleton template
          <GenericLoader />
        ) : (
          <PriceMarket marketId={marketId} marketContractValues={marketContractValues} />
        )}
      </MainPanel.Container>
    </div>
  );
};
