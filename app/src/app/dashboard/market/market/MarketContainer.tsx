import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";
import { GenericLoader } from "ui/generic-loader/GenericLoader";

import { Market } from "./Market";
import { MarketContainerProps } from "./Market.types";

export const MarketContainer = ({ marketId }: MarketContainerProps) => {
  const { marketContractValues } = useNearMarketContract({ marketId });

  if (!marketContractValues) {
    return <GenericLoader />;
  }

  return <Market marketId={marketId} marketContractValues={marketContractValues} />;
};
