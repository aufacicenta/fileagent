import { ReactNode } from "react";

import { DeployMarketContractArgs } from "providers/near/contracts/market-factory/market-factory.types";
import { AccountId } from "providers/near/contracts/market/market.types";

export type NearMarketFactoryContractContextControllerProps = {
  children: ReactNode;
};

export type NearMarketFactoryContractContextType = {
  fetchLatestPriceMarket: () => Promise<void>;
  createMarket: (args: DeployMarketContractArgs) => Promise<void>;
  createPriceMarket: (args: PartialCreatePriceMarketContractArgs) => Promise<void>;
  marketId?: AccountId;
};

export type PartialCreatePriceMarketContractArgs = {
  startsAt: DeployMarketContractArgs["market"]["starts_at"];
  endsAt: DeployMarketContractArgs["market"]["ends_at"];
  resolutionWindow: DeployMarketContractArgs["resolution"]["window"];
};
