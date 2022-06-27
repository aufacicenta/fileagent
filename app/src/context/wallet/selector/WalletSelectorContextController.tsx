import React from "react";

import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { useNearWallet } from "../near/useNearWallet";

import {
  WalletSelectorChain,
  WalletSelectorContextControllerProps,
  WalletSelectorContextType,
} from "./WalletSelectorContext.types";
import { WalletSelectorContext } from "./WalletSelectorContext";

export const WalletSelectorContextController = ({ children }: WalletSelectorContextControllerProps) => {
  const walletState = useWalletStateContext();
  const nearWallet = useNearWallet();

  const onConnect = (chain: WalletSelectorChain) => {
    walletState.chain.set(chain);

    switch (chain) {
      case WalletSelectorChain.near:
        nearWallet.onConnect();
        break;
      default:
        break;
    }
  };

  const onDisconnect = () => {
    switch (walletState.chain.get()) {
      case WalletSelectorChain.near:
        nearWallet.onDisconnect();
        break;
      default:
        break;
    }
  };

  const props: WalletSelectorContextType = {
    onConnect,
    onDisconnect,
  };

  return <WalletSelectorContext.Provider value={props}>{children}</WalletSelectorContext.Provider>;
};
