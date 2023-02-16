import { useEffect } from "react";

import { useNearMarketFactoryContractContext } from "context/near/market-factory-contract/useNearMarketFactoryContractContext";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";

import { LatestPriceMarketsTable } from "./LatestPriceMarketsTable";

export const LatestPriceMarketsTableContainer = () => {
  const { fetchLatestPriceMarkets, latestPriceMarketsIds, actions } = useNearMarketFactoryContractContext();

  useEffect(() => {
    fetchLatestPriceMarkets();
  }, []);

  return (
    <Card>
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
