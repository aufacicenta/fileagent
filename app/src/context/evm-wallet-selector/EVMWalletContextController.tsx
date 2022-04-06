import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Web3Modal from "web3modal";
import Web3 from "web3";

import { WalletSelectorChain, WalletSelectorContextType } from "context/wallet-selector/WalletSelectorContext.types";
import { WalletSelectorContextController } from "context/wallet-selector/WalletSelectorContextController";
import { useWalletState } from "hooks/useWalletState/useWalletState";

import { Provider, EVMWalletSelectorContextControllerProps } from "./EVMWalletSelectorContext.types";

export const EVMWalletSelectorContextController = ({ children }: EVMWalletSelectorContextControllerProps) => {
  const walletState = useWalletState();
  const [provider, setProvider] = useState<Provider | undefined>();

  useEffect(() => {
    if (provider && !walletState.isConnected.get()) {
      (async () => {
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const selectedAccount = accounts[0];
        const balance = await web3.eth.getBalance(selectedAccount);
        walletState.address.set(selectedAccount);
        walletState.balance.set(web3.utils.fromWei(balance, "ether"));
      })();
    }
  }, [provider, walletState.address, walletState.balance, walletState.isConnected]);

  const web3modal = useMemo(() => {
    if (typeof window !== "undefined") {
      // Should provider options come from props?
      return new Web3Modal({
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
            },
          },
        },
      });
    }

    return undefined;
  }, []);

  const connect = useCallback(async () => {
    try {
      const web3Provider = await web3modal?.connect();

      setProvider(web3Provider);
      walletState.isConnected.set(true);
    } catch {
      web3modal?.clearCachedProvider();
    }
  }, [walletState.isConnected, web3modal]);

  const disconnect = useCallback(async () => {
    try {
      if (provider.close) {
        await provider.close();
      }

      web3modal?.clearCachedProvider();

      setProvider(undefined);
      walletState.isConnected.set(false);
      walletState.balance.set("0.00");
      walletState.address.set("");
    } catch {
      web3modal?.clearCachedProvider();
    }
  }, [provider, web3modal, walletState.isConnected, walletState.balance, walletState.address]);

  const onClickConnect = async () => {
    if (walletState.isConnected.get()) {
      await disconnect();

      return;
    }

    await connect();
  };

  const onSetChain = (c: WalletSelectorChain) => {
    walletState.chain.set(c);
  };

  const props: WalletSelectorContextType = {
    onClickConnect,
    isConnected: walletState.isConnected.get(),
    network: walletState.network.get(),
    explorer: walletState.explorer.get(),
    chain: walletState.chain.get(),
    address: walletState.address.get(),
    balance: walletState.balance.get(),
    onSetChain,
    context: {
      connection: undefined,
      provider,
      guest: {
        address: "",
      },
    },
  };

  return <WalletSelectorContextController {...props}>{children}</WalletSelectorContextController>;
};
