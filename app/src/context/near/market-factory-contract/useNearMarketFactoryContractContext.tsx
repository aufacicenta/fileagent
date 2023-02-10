import { useContext } from "react";

import { NearMarketFactoryContractContext } from "./NearMarketFactoryContractContext";

export const useNearMarketFactoryContractContext = () => {
  const context = useContext(NearMarketFactoryContractContext);

  if (context === undefined) {
    throw new Error("useNearMarketFactoryContractContext must be used within a NearMarketFactoryContractContext");
  }

  return context;
};
