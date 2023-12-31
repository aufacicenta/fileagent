import { ReactNode, useState } from "react";
import { NetworkId } from "@near-wallet-selector/core";

import { Address, Balance, Chain, Context, Explorer, IsConnected, StateActions } from "./WalletStateContext.types";
import { WalletStateContext } from "./WalletStateContext";

export const WalletStateContextController = ({ children }: { children: ReactNode }) => {
  const [network, setNetwork] = useState<NetworkId | undefined>("testnet");
  const [explorer, setExplorer] = useState<Explorer>(undefined);
  const [chain, setChain] = useState<Chain>(undefined);
  const [address, setAddress] = useState<Address>(undefined);
  const [balance, setBalance] = useState<Balance>("0.00");
  const [isConnected, setIsConnected] = useState<IsConnected>(false);
  const [context, setContext] = useState<Context>({
    connection: undefined,
    provider: undefined,
    guest: {
      address: "",
    },
  });
  const [actions, setActions] = useState<StateActions>({
    isGettingGuestWallet: false,
  });

  const reset = () => {
    setNetwork(undefined);
    setExplorer(undefined);
    setChain(undefined);
    setAddress(undefined);
    setBalance("0.00");
    setIsConnected(false);
    setActions({ isGettingGuestWallet: false });
  };

  const props = {
    setNetwork,
    setAddress,
    setExplorer,
    setChain,
    setBalance,
    setIsConnected,
    setContext,
    setActions,
    network,
    address,
    explorer,
    chain,
    balance,
    isConnected,
    reset,
    context,
    actions,
  };

  return <WalletStateContext.Provider value={props}>{children}</WalletStateContext.Provider>;
};
