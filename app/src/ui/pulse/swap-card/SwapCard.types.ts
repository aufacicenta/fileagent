import { Dispatch, ReactNode, SetStateAction } from "react";

import { AccountId, MarketContractValues, OutcomeToken } from "providers/near/contracts/market/market.types";

export type SwapCardProps = {
  marketContractValues: MarketContractValues;
  selectedOutcomeToken: OutcomeToken;
  setSelectedOutcomeToken: Dispatch<SetStateAction<OutcomeToken | undefined>>;
  marketId: AccountId;
  children?: ReactNode;
  className?: string;
};

export type SwapCardForm = {
  fromTokenAmount: string;
  toTokenAmount: string;
};
