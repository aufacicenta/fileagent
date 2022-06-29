import { ReactNode } from "react";

import { MarketData } from "providers/near/contracts/market/market.types";

export type MarketCardProps = {
  marketData: MarketData;
  expanded?: boolean;
  children?: ReactNode;
  className?: string;
};
