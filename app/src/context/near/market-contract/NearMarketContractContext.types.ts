import { ReactNode } from "react";

import { AccountId, MarketContractMethods, MarketContractValues } from "providers/near/contracts/market/market.types";

export type NearMarketContractContextControllerProps = {
  marketId: AccountId;
  preventLoad?: boolean;
  children: ReactNode;
};

export type NearMarketContractContextType = {
  fetchMarketContractValues: () => Promise<void>;
  getBalanceOf: MarketContractMethods["balance_of"];
  getAmountMintable: MarketContractMethods["get_amount_mintable"];
  getAmountPayable: MarketContractMethods["get_amount_payable"];
  sell: MarketContractMethods["sell"];
  onClickResolveMarket: () => Promise<false | void>;
  marketContractValues?: MarketContractValues;
};

export type NEARSignInOptions = {
  contractId?: string;
  methodNames?: string[];
  successUrl?: string;
  failureUrl?: string;
};
