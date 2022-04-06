import { createContext } from "react";

import { WalletSelectorContextType } from "context/wallet-selector/WalletSelectorContext.types";

export const EVMWalletSelectorContext = createContext<WalletSelectorContextType | undefined>(undefined);
