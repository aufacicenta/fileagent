import { ReactNode } from "react";

import { MarketContractValues, OutcomeToken } from "providers/near/contracts/market/market.types";

export type SwapCardProps = {
  marketContractValues: MarketContractValues;
  selectedOutcomeToken: OutcomeToken;
  onSubmit: (values: Record<string, unknown>) => void;
  children?: ReactNode;
  className?: string;
};
