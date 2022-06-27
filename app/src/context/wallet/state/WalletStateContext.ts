import { createContext } from "react";

import { WalletStateContextType } from "./WalletStateContext.types";

export const WalletStateContext = createContext<WalletStateContextType | undefined>(undefined);
