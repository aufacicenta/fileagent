import { ReactNode } from "react";

import { MarketContractValues } from "providers/near/contracts/market/market.types";

export type MarketOptionsProps = {
  marketContractValues: MarketContractValues;
  children?: ReactNode;
  className?: string;
};
