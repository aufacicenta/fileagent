import { ReactNode } from "react";

import { AccountId, MarketContractValues, WrappedBalance } from "providers/near/contracts/market/market.types";

export type SwapCardProps = {
  marketContractValues: MarketContractValues;
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
