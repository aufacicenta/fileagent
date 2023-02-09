import { Dispatch, ReactNode, SetStateAction } from "react";

import {
  AccountId,
  MarketContractValues,
  OutcomeToken,
  WrappedBalance,
} from "providers/near/contracts/market/market.types";

export type SwapCardProps = {
  marketContractValues: MarketContractValues;
  selectedOutcomeToken: OutcomeToken;
  setSelectedOutcomeToken: Dispatch<SetStateAction<OutcomeToken | undefined>>;
  marketId: AccountId;
  isBettingEnabled: boolean;
  children?: ReactNode;
  className?: string;
};

export type SwapCardForm = {
  fromTokenAmount: string;
  toTokenAmount: string;
};

export type Token = { symbol: string; amount: WrappedBalance };
