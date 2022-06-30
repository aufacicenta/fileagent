import { ReactNode } from "react";

import { MarketContractValues } from "providers/near/contracts/market/market.types";

export type MarketCardProps = {
  marketContractValues: MarketContractValues;
  onClickPublishMarket: () => void;
  expanded?: boolean;
  children?: ReactNode;
  className?: string;
};

export type MarketCardContainerProps = {
  marketId: string;
  expanded?: boolean;
  children?: ReactNode;
  className?: string;
};
