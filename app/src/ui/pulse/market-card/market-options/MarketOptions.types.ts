import { ReactNode } from "react";

import { MarketContractValues, OutcomeToken } from "providers/near/contracts/market/market.types";

export type MarketOptionsProps = {
  marketContractValues: MarketContractValues;
  onClickOutcomeToken: (outcomeToken: OutcomeToken) => void;
  children?: ReactNode;
  className?: string;
};
