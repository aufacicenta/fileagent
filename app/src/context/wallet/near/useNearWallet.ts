import { useEffect } from "react";

import near from "providers/near";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { WalletSelectorChain } from "../selector/WalletSelectorContext.types";

export const useNearWallet = () => {
  const walletState = useWalletStateContext();

  useEffect(() => {
    if (!!walletState.context.get()?.connection?.isSignedIn() && !!walletState.context.get().provider) {
      return;
    }

    (async () => {
      const { near: provider, wallet: connection } = await near.initWalletConnection(walletState.network.get());

      if (connection.isSignedIn()) {
        walletState.isConnected.set(true);
        walletState.context.set({ connection, provider, guest: { address: "guest.near" } });
        walletState.chain.set(WalletSelectorChain.near);

        const accountId = connection.getAccountId();
        walletState.address.set(accountId);

        const accountBalance = await near.getAccountBalance(provider, accountId);
        walletState.balance.set(near.formatAccountBalance(accountBalance.available, 5));
      }
    })();
  }, [
    walletState.address,
    walletState.balance,
    walletState.isConnected,
    walletState.network,
    walletState.chain,
    walletState.context,
  ]);

  const onConnect = async () => {
    try {
      const { wallet: connection } = await near.initWalletConnection(walletState.network.get());
      await connection.requestSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const onDisconnect = () => {
    const { connection } = walletState.context.get();
    connection?.signOut();
    walletState.reset();
  };

  return {
    onConnect,
    onDisconnect,
  };
};
