import { useEffect } from "react";
import clsx from "clsx";

import { useNearMarketFactoryContractContext } from "context/near/market-factory-contract/useNearMarketFactoryContractContext";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";

import { LatestPriceMarketsTable } from "./LatestPriceMarketsTable";
import styles from "./LatestPriceMarketsTable.module.scss";

export const LatestPriceMarketsTableContainer = () => {
  const { fetchLatestPriceMarkets, latestPriceMarketsIds, actions } = useNearMarketFactoryContractContext();

  useEffect(() => {
    fetchLatestPriceMarkets();
  }, []);

  return (
    <Card className={clsx(styles["latest-price-markets-table__card"])}>
      <Card.Content>
        {latestPriceMarketsIds.length === 0 || actions.fetchLatestPriceMarkets.isLoading ? (
          <Typography.Text>Fetching latest price markets</Typography.Text>
        ) : (
          <LatestPriceMarketsTable />
        )}
      </Card.Content>
    </Card>
  );
};
