import { createContext } from "react";

import { WalletSelectorContextType } from "./WalletSelectorContext.types";

export const WalletSelectorContext = createContext<WalletSelectorContextType | undefined>(undefined);
