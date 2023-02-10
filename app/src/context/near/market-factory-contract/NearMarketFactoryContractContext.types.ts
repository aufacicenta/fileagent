import { ReactNode } from "react";

import { DeployMarketContractArgs } from "providers/near/contracts/market-factory/market-factory.types";
import { AccountId } from "providers/near/contracts/market/market.types";

export type NearMarketFactoryContractContextControllerProps = {
  children: ReactNode;
};

export type NearMarketFactoryContractContextType = {
  fetchLatestPriceMarket: () => Promise<void>;
  createMarket: (args: DeployMarketContractArgs) => Promise<void>;
  createPriceMarket: () => Promise<void>;
  marketId?: AccountId;
};
