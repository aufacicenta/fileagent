import { useContext } from "react";

import { WalletStateContext } from "context/wallet/state/WalletStateContext";

export const useWalletStateContext = () => {
  const context = useContext(WalletStateContext);

  if (context === undefined) {
    throw new Error("useWalletStateContext must be used within a WalletStateContext");
  }

  return context;
};
