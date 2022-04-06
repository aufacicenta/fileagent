import { ReactNode } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

export type Provider = WalletConnectProvider | Web3["givenProvider"];

export type EVMWalletSelectorContextControllerProps = {
  children: ReactNode;
};
