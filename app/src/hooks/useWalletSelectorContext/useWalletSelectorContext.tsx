import { useContext } from "react";

import { WalletSelectorContext } from "../../context/wallet-selector/WalletSelectorContext";

export const useWalletSelectorContext = () => {
  const context = useContext(WalletSelectorContext);

  if (context === undefined) {
    throw new Error("useWalletSelectorContext must be used within a WalletSelectorContext");
  }

  return context;
};
