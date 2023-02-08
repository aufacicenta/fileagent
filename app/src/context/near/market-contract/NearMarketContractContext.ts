import { createContext } from "react";

import { NearMarketContractContextType } from "./NearMarketContractContext.types";

export const NearMarketContractContext = createContext<NearMarketContractContextType | undefined>(undefined);
