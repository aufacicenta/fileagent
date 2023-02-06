import { NetworkId, Wallet } from "@near-wallet-selector/core";
import { Near, WalletConnection as NEARWalletConnection } from "near-api-js";
import { Dispatch, SetStateAction } from "react";

import { WalletSelectorChain } from "context/wallet-selector/WalletSelectorContext.types";

export type Address = string | undefined;
export type Explorer = string | undefined;
export type Balance = string | undefined;
export type Chain = WalletSelectorChain | undefined;
export type IsConnected = boolean;
export type Network = NetworkId | undefined;

export type Context = {
  wallet?: Wallet;
  connection?: NEARWalletConnection;
  provider?: Near;
  guest: { address: Address };
};

export type WalletStateContextType = {
  reset: () => void;
  setAddress: Dispatch<SetStateAction<Address>>;
  setNetwork: Dispatch<SetStateAction<Network>>;
  setExplorer: Dispatch<SetStateAction<Explorer>>;
  setBalance: Dispatch<SetStateAction<Balance>>;
  setChain: Dispatch<SetStateAction<Chain>>;
  setIsConnected: Dispatch<SetStateAction<IsConnected>>;
  setContext: Dispatch<SetStateAction<Context>>;
  address: Address;
  network: Network;
  explorer: Explorer;
  balance: Balance;
  chain: Chain;
  isConnected: IsConnected;
  context: Context;
};
