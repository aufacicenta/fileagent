import { ReactNode } from "react";

import { AccountId, MarketContractValues, OutcomeToken } from "providers/near/contracts/market/market.types";

export type SwapCardProps = {
  marketContractValues: MarketContractValues;
  selectedOutcomeToken: OutcomeToken;
  onSubmit: (values: Record<string, unknown>) => void;
  marketId: AccountId;
  children?: ReactNode;
  className?: string;
};

export type SwapCardForm = {
  fromTokenAmount: string;
  toTokenAmount: string;
};
