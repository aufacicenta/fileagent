import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";

import styles from "./Home.module.scss";
import { HomeProps } from "./Home.types";

export const Home: React.FC<HomeProps> = ({ className }) => {
  const [, setMarkets] = useState<Array<string>>([]);

  const toast = useToastContext();

  const { t } = useTranslation(["home", "common"]);

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

  return (
    <div className={clsx(styles.home, className)}>
      <MainPanel.Container>
        <Typography.Headline1>{t("home.title")}</Typography.Headline1>
      </MainPanel.Container>
    </div>
  );
};
