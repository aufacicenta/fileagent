import { ReactNode } from "react";

import { MarketContractValues, OutcomeToken } from "providers/near/contracts/market/market.types";

export type MarketCardProps = {
  marketContractValues: MarketContractValues;
  onClickPublishMarket: () => void;
  onClickOutcomeToken: (outcomeToken: OutcomeToken) => void;
  onClickMarketTitle?: () => void;
  marketId: string;
  expanded?: boolean;
  children?: ReactNode;
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
