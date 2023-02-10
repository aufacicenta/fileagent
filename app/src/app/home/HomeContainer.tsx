import { useEffect } from "react";

import { GenericLoader } from "ui/generic-loader/GenericLoader";
import { NearMarketContractContextController } from "context/near/market-contract/NearMarketContractContextController";
import { useNearMarketFactoryContractContext } from "context/near/market-factory-contract/useNearMarketFactoryContractContext";

import { Home } from "./Home";

export const HomeContainer = () => {
  const { fetchLatestPriceMarket, marketId } = useNearMarketFactoryContractContext();

  useEffect(() => {
    fetchLatestPriceMarket();
  }, [marketId]);

  if (!marketId) {
    return <GenericLoader />;
  }

  return (
    <NearMarketContractContextController marketId={marketId}>
      <Home marketId={marketId} />
    </NearMarketContractContextController>
  );
};
