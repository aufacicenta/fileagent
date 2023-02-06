import React, { useEffect, useState } from "react";
import { NetworkId, setupWalletSelector, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupNearFi } from "@near-wallet-selector/nearfi";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";

import near from "providers/near";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { DEFAULT_NETWORK_ENV } from "providers/near/getConfig";
import { WalletSelectorChain } from "context/wallet-selector/WalletSelectorContext.types";

import { NearWalletSelectorContextControllerProps } from "./NearWalletSelectorContext.types";
import { NearWalletSelectorContext } from "./NearWalletSelectorContext";

export const NearWalletSelectorContextController = ({ children }: NearWalletSelectorContextControllerProps) => {
  const [selector, setSelector] = useState<WalletSelector>();
  const [modal, setModal] = useState<WalletSelectorModal>();

  const walletStateContext = useWalletStateContext();

  const onSignedIn = async (s: WalletSelector) => {
    try {
      const connection = await near.initWalletConnection();

      const { near: nearAPI, wallet: nearWalletConnection } = connection;

      walletStateContext.setContext({
        connection: nearWalletConnection,
        provider: nearAPI,
        guest: {
          address: near.getConfig().guestWalletId,
        },
      });

      const wallet = await s?.wallet();

      if (!wallet) {
        return;
      }

      const [account] = await wallet.getAccounts();

      walletStateContext.setIsConnected(true);
      walletStateContext.setAddress(account.accountId);
      walletStateContext.setNetwork(DEFAULT_NETWORK_ENV);
      walletStateContext.setChain(WalletSelectorChain.near);
      walletStateContext.setExplorer(near.getConfig().explorerUrl);

      const accountBalance = await near.getAccountBalance(nearAPI, account.accountId);
      walletStateContext.setBalance(near.formatAccountBalance(accountBalance.available, 8));
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      const wallet = await selector?.wallet()!;

      await wallet.signOut();

      walletStateContext.reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const walletSelector = await setupWalletSelector({
        network: near.getConfig().networkId as NetworkId,
        modules: [
          setupNearWallet(),
          setupMyNearWallet(),
          setupNearFi(),
          setupHereWallet(),
          setupMathWallet(),
          setupSender(),
          setupNightly(),
          setupMeteorWallet(),
          setupLedger(),
          setupCoin98Wallet(),
        ],
      });

      const onSignedInSub = walletSelector.on("signedIn", () => onSignedIn(walletSelector));

      setSelector(walletSelector);

      return () => {
        onSignedInSub.remove();
      };
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const wallet = await selector?.wallet();

      if (!selector || !wallet) {
        return;
      }

      onSignedIn(selector!);
    })();
  }, [selector]);

  const initModal = (contractId: string) => {
    setModal(
      setupModal(selector!, {
        contractId,
      }),
    );
  };

  const props = {
    selector,
    modal,
    initModal,
    signOut,
  };

  return <NearWalletSelectorContext.Provider value={props}>{children}</NearWalletSelectorContext.Provider>;
};
