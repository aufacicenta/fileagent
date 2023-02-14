import { ReactNode } from "react";

import {
  AccountId,
  MarketContractMethods,
  MarketContractValues,
  OutcomeToken,
} from "providers/near/contracts/market/market.types";

export type NearMarketContractContextControllerProps = {
  marketId: AccountId;
  preventLoad?: boolean;
  children: ReactNode;
};

export type NearMarketContractContextType = {
  fetchMarketContractValues: () => Promise<void>;
  onClickResolveMarket: () => Promise<false | void>;
  onClickOutcomeToken: (outcomeToken: OutcomeToken) => void;
  bettingPeriodExpired: () => boolean;
  calculateTotalOutcomeTokensPosition: () => Promise<void>;
  marketId: AccountId;
  getBalanceOf: MarketContractMethods["balance_of"];
  getAmountMintable: MarketContractMethods["get_amount_mintable"];
  getAmountPayable: MarketContractMethods["get_amount_payable"];
  sell: MarketContractMethods["sell"];
  marketContractValues?: MarketContractValues;
  actions: NearMarketContractContextActions;
  selectedOutcomeToken?: OutcomeToken;
  outcomeTokensExtended?: OutcomeToken[];
};

export type NearMarketContractContextActions = { fetchMarketContractValues: { isLoading: boolean } };
