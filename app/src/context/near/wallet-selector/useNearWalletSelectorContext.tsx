import { useContext } from "react";

import { NearWalletSelectorContext } from "context/near/wallet-selector/NearWalletSelectorContext";

export const useNearWalletSelectorContext = () => {
  const context = useContext(NearWalletSelectorContext);

  if (context === undefined) {
    throw new Error("useNearWalletSelectorContext must be used within a NearWalletSelectorContext");
  }

  return context;
};
