import React from "react";

import { WalletSelectorContext } from "./WalletSelectorContext";
import { WalletSelectorContextControllerProps } from "./WalletSelectorContext.types";

export const WalletSelectorContextController = ({ children, ...props }: WalletSelectorContextControllerProps) => (
  <WalletSelectorContext.Provider value={props}>{children}</WalletSelectorContext.Provider>
);
