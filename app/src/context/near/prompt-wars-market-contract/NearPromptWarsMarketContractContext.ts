import { createContext } from "react";

import { NearPromptWarsMarketContractContextContextType } from "./NearPromptWarsMarketContractContextContext.types";

export const NearPromptWarsMarketContractContext = createContext<
  NearPromptWarsMarketContractContextContextType | undefined
>(undefined);
