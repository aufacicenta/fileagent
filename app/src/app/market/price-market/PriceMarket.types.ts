import { ReactNode } from "react";

import { AccountId } from "providers/near/contracts/market/market.types";

export type PriceMarketProps = {
  marketId: AccountId;
  children?: ReactNode;
  className?: string;
};

export type PriceMarketContainerProps = {
  marketId: AccountId;
};
