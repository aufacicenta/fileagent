import { ReactNode } from "react";

export type WalletSelectorContextControllerProps = {
  children: ReactNode;
};

export enum WalletSelectorChain {
  near = "near",
  evm = "evm",
  solana = "solana",
}

export type WalletSelectorContextType = {
  onConnect: (chain: WalletSelectorChain) => void;
  onDisconnect: () => void;
};
