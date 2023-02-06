import { createContext } from "react";

import { NearWalletSelectorContextType } from "./NearWalletSelectorContext.types";

export const NearWalletSelectorContext = createContext<NearWalletSelectorContextType | undefined>(undefined);
