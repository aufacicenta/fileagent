import { ReactNode } from "react";

import { AccountId } from "providers/near/contracts/market/market.types";

export type PriceMarketTableRowProps = {
  marketId: AccountId;
  children?: ReactNode;
  className?: string;
};
