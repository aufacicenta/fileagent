import { ReactNode } from "react";

import { AccountId, MarketContractValues } from "providers/near/contracts/market/market.types";

export type MarketProps = {
  marketId: AccountId;
  marketContractValues: MarketContractValues;
  children?: ReactNode;
  className?: string;
};

export type MarketContainerProps = {
  marketId: AccountId;
};
