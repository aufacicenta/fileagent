import { useEffect } from "react";

import { GenericLoader } from "ui/generic-loader/GenericLoader";
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

  return <Home marketId={marketId} />;
};
