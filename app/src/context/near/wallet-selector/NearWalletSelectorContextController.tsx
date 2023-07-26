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
import { useWalletStateContext } from "context/wallet/state/useWalletStateContext";
import { WalletSelectorChain } from "context/wallet-selector/WalletSelectorContext.types";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { setupGuestWallet } from "providers/near/wallet-selector/setupGuestWallet";
import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";

import { NearWalletSelectorContextControllerProps } from "./NearWalletSelectorContext.types";
import { NearWalletSelectorContext } from "./NearWalletSelectorContext";

export const NearWalletSelectorContextController = ({ children }: NearWalletSelectorContextControllerProps) => {
  const [selector, setSelector] = useState<WalletSelector>();
  const [modal, setModal] = useState<WalletSelectorModal>();

  const walletStateContext = useWalletStateContext();

  const routes = useRoutes();
  const ls = useLocalStorage();

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

      walletStateContext.setContext({
        wallet,
        connection: nearWalletConnection,
        provider: nearAPI,
        guest: {
          address: account.accountId,
        },
      });

      walletStateContext.setIsConnected(s.isSignedIn());
      walletStateContext.setAddress(account.accountId);
      walletStateContext.setNetwork(near.getConfig().networkId as NetworkId);
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
      try {
        const network = near.getConfig().networkId as NetworkId;

        const walletSelector = await setupWalletSelector({
          network,
          modules: [
            setupGuestWallet(),
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
      } catch (error) {
        console.log(error);
      }

      return undefined;
    })();
  }, []);

  useEffect(() => {
    if (!selector) {
      return;
    }

    (async () => {
      try {
        const wallet = await selector?.wallet();

        if (!wallet) {
          return;
        }

        onSignedIn(selector!);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selector]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(routes.api.promptWars.createGuestAccount());
        const result = await response.json();

        ls.set(Object.keys(result)[0], result[Object.keys(result)[0]]);
        ls.set(Object.keys(result)[1], result[Object.keys(result)[1]]);
        ls.set(Object.keys(result)[2], result[Object.keys(result)[2]]);

        console.log(result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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
