import { useContext } from "react";

import { NearPromptWarsMarketContractContext } from "./NearPromptWarsMarketContractContext";

export const useNearPromptWarsMarketContractContext = () => {
  const context = useContext(NearPromptWarsMarketContractContext);

  if (context === undefined) {
    throw new Error("useNearPromptWarsMarketContractContext must be used within a NearPromptWarsMarketContractContext");
  }

  return context;
};
