import { ReactNode } from "react";

import { AccountId, PromptWarsMarketContractValues } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type NearPromptWarsMarketContractContextControllerProps = {
  marketId: AccountId;
  preventLoad?: boolean;
  children: ReactNode;
};

export type NearPromptWarsMarketContractContextContextType = {
  fetchMarketContractValues: () => Promise<void>;
  bettingPeriodExpired: () => boolean;
  marketId: AccountId;
  // getBalanceOf: PromptWarsMarketContractMethods["balance_of"];
  // getAmountMintable: PromptWarsMarketContractMethods["get_amount_mintable"];
  // getAmountPayableResolved: PromptWarsMarketContractMethods["get_amount_payable_resolved"];
  // getAmountPayableUnresolved: PromptWarsMarketContractMethods["get_amount_payable_unresolved"];
  // sell: PromptWarsMarketContractMethods["sell"];
  marketContractValues?: PromptWarsMarketContractValues;
  actions: NearPromptWarsMarketContractContextContextActions;
};

export type NearPromptWarsMarketContractContextContextActions = { fetchMarketContractValues: { isLoading: boolean } };
