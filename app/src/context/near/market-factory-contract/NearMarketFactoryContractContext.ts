import { createContext } from "react";

import { NearMarketFactoryContractContextType } from "./NearMarketFactoryContractContext.types";

export const NearMarketFactoryContractContext = createContext<NearMarketFactoryContractContextType | undefined>(
  undefined,
);
