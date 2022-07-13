import { ReactNode } from "react";

import { CollateralTokenMetadata } from "providers/near/contracts/market/market.types";

export type CollateralTokenBalanceProps = {
  collateralTokenMetadata: CollateralTokenMetadata;
  marketId: string;
  children?: ReactNode;
  className?: string;
};
