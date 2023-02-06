import { ReactNode } from "react";

import { MarketContractValues } from "providers/near/contracts/market/market.types";

export type HomeProps = {
  marketContractValues: MarketContractValues;
  children?: ReactNode;
  className?: string;
};
