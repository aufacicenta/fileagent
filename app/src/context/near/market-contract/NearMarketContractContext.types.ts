import { ReactNode } from "react";

import { AccountId, MarketContractMethods, MarketContractValues } from "providers/near/contracts/market/market.types";

export type NearMarketContractContextControllerProps = {
  marketId: AccountId;
  preventLoad?: boolean;
  children: ReactNode;
};

export type NearMarketContractContextType = {
  fetchMarketContractValues: () => Promise<void>;
  onClickResolveMarket: () => Promise<false | void>;
  bettingPeriodExpired: () => boolean;
  getBalanceOf: MarketContractMethods["balance_of"];
  getAmountMintable: MarketContractMethods["get_amount_mintable"];
  getAmountPayable: MarketContractMethods["get_amount_payable"];
  sell: MarketContractMethods["sell"];
  marketContractValues?: MarketContractValues;
  actions: NearMarketContractContextActions;
};

export type NearMarketContractContextActions = { fetchMarketContractValues: { isLoading: boolean } };
