import { useState } from "react";

import { WalletSelectorChain, WalletSelectorContextType } from "context/wallet-selector/WalletSelectorContext.types";

export const useWalletState = () => {
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [explorer, setExplorer] = useState<string | undefined>(undefined);
  const [chain, setChain] = useState<WalletSelectorChain | undefined>(undefined);
  const [address, setAddress] = useState<WalletSelectorContextType["address"]>(undefined);
  const [balance, setBalance] = useState("0.00");
  const [isConnected, setIsConnected] = useState(false);

  return {
    network: { get: () => network, set: setNetwork },
    explorer: { get: () => explorer, set: setExplorer },
    chain: { get: () => chain, set: setChain },
    address: { get: () => address, set: setAddress },
    balance: { get: () => balance, set: setBalance },
    isConnected: { get: () => isConnected, set: setIsConnected },
  };
};
