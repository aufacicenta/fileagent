import { ReactNode } from "react";

import { MarketContractValues } from "providers/near/contracts/market/market.types";

export type ImgPromptCardProps = {
  marketContractValues: MarketContractValues;
  marketId: string;
  currentResultElement?: ReactNode;
  datesElement?: ReactNode;
  children?: ReactNode;
  className?: string;
};
