import { ReactNode } from "react";

import { CollateralTokenMetadata } from "providers/near/contracts/market/market.types";

export type CollateralTokenBalanceProps = {
  collateralTokenMetadata: CollateralTokenMetadata;
  children?: ReactNode;
  className?: string;
};
