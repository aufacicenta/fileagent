import { ReactNode } from "react";

import { MarketContractValues } from "providers/near/contracts/market/market.types";

export type MarketCardProps = {
  marketContractValues: MarketContractValues;
  onClickResolveMarket: () => void;
  onClickMarketTitle?: () => void;
  marketId: string;
  expanded?: boolean;
  currentResultElement?: ReactNode;
  datesElement?: ReactNode;
  className?: string;
};

export type MarketCardContainerProps = {
  marketId: string;
  onClickOutcomeToken: () => void;
  onClickMarketTitle: () => void;
  expanded?: boolean;
  children?: ReactNode;
  className?: string;
};
