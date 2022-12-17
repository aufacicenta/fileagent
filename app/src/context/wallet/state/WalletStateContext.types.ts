import { NetworkId } from "@near-wallet-selector/core";
import { Near, WalletConnection as NEARWalletConnection } from "near-api-js";
import { Dispatch, SetStateAction } from "react";

import { WalletSelectorChain } from "../selector/WalletSelectorContext.types";

export type Address = string | undefined;
export type Explorer = string | undefined;
export type Balance = string | undefined;
export type Chain = WalletSelectorChain | undefined;
export type IsConnected = boolean;

export type Context = {
  connection?: NEARWalletConnection;
  provider?: Near;
  guest: { address: Address };
};

export type WalletStateContextType = {
  reset: () => void;
  address: {
    get: () => Address;
    set: Dispatch<SetStateAction<Address>>;
  };
  network: {
    get: () => NetworkId | undefined;
    set: Dispatch<SetStateAction<NetworkId | undefined>>;
  };
  explorer: {
    get: () => Explorer;
    set: Dispatch<SetStateAction<Explorer>>;
  };
  balance: {
    get: () => Balance;
    set: Dispatch<SetStateAction<Balance>>;
  };
  chain: {
    get: () => Chain;
    set: Dispatch<SetStateAction<Chain>>;
  };
  isConnected: {
    get: () => IsConnected;
    set: Dispatch<SetStateAction<IsConnected>>;
  };
  context: {
    get: () => Context;
    set: Dispatch<SetStateAction<Context>>;
  };
};
