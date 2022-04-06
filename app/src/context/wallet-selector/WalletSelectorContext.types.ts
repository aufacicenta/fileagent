import { Near, WalletConnection as NEARWalletConnection } from "near-api-js";
import { ReactNode } from "react";

import { Provider } from "context/evm-wallet-selector/EVMWalletSelectorContext.types";

export type WalletSelectorContextControllerProps = {
  children: ReactNode;
} & WalletSelectorContextType;

export enum WalletSelectorChain {
  near = "near",
  evm = "evm",
}

export type WalletSelectorContextType = {
  address?: string | null;
  network?: string;
  explorer?: string;
  balance: string;
  chain?: WalletSelectorChain;
  isConnected: boolean;
  onSetChain: (chain: WalletSelectorChain) => void;
  onClickConnect: () => void;
  context: {
    connection: NEARWalletConnection | undefined;
    provider: Near | Provider | undefined;
    guest: { address: string };
  };
};
