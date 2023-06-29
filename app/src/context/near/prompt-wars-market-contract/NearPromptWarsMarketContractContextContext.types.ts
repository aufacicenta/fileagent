import { ReactNode } from "react";

import {
  AccountId,
  Prompt,
  PromptWarsMarketContractValues,
} from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type NearPromptWarsMarketContractContextControllerProps = {
  marketId: AccountId;
  preventLoad?: boolean;
  children: ReactNode;
};

export type NearPromptWarsMarketContractContextContextType = {
  fetchMarketContractValues: () => Promise<void>;
  ftTransferCall: (prompt: Prompt) => Promise<void>;
  marketId: AccountId;
  sell: () => Promise<void>;
  marketContractValues?: PromptWarsMarketContractValues;
  actions: NearPromptWarsMarketContractContextContextActions;
};

export type NearPromptWarsMarketContractContextContextActions = {
  fetchMarketContractValues: { isLoading: boolean };
  ftTransferCall: {
    isLoading: boolean;
  };
};
