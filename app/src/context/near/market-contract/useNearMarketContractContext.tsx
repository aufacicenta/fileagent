import { useContext } from "react";

import { NearMarketContractContext } from "./NearMarketContractContext";

export const useNearMarketContractContext = () => {
  const context = useContext(NearMarketContractContext);

  if (context === undefined) {
    throw new Error("useNearMarketContractContext must be used within a NearMarketContractContext");
  }

  return context;
};
