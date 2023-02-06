import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";
import { GenericLoader } from "ui/generic-loader/GenericLoader";

import { Home } from "./Home";

export const HomeContainer = () => {
  // @TODO fetch latest price market from market-factory contract
  const marketId = "price-4.market-factory-2.pulsemarkets.testnet";

  const { marketContractValues } = useNearMarketContract({ marketId });

  if (!marketContractValues) {
    return <GenericLoader />;
  }

  return <Home marketContractValues={marketContractValues} marketId={marketId} />;
};
