import { Near, WalletConnection as NEARWalletConnection } from "near-api-js";
import { ReactNode } from "react";

import { NEARSignInOptions } from "context/near/wallet-selector/NearWalletSelectorContext.types";

export type WalletSelectorContextControllerProps = {
  children: ReactNode;
} & WalletSelectorContextType;

export enum WalletSelectorChain {
  near = "near",
}

export type WalletSelectorContextType = {
  address?: string | null;
  network?: string;
  explorer?: string;
  balance: string;
  chain?: WalletSelectorChain;
  isConnected: boolean;
  onSetChain: (chain: WalletSelectorChain) => void;
  onClickConnect: (args?: NEARSignInOptions) => void;
  onClickDisconnect: () => void;
  onSignedIn: () => void;
  context: {
    connection: NEARWalletConnection | undefined;
    provider: Near | undefined;
    guest: { address: string };
  };
};
