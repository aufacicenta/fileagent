import { useToastContext } from "hooks/useToastContext/useToastContext";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { Typography } from "ui/typography/Typography";
import { AccountId, OutcomeId } from "../market/market.types";
import currency from "providers/currency";

import { FungibleTokenContract } from ".";

export default () => {
  const toast = useToastContext();
  const wallet = useWalletStateContext();

  const getWalletBalance = async (contractAddress: AccountId) => {
    if (!wallet.isConnected.get()) {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Failed to fetch collateral token balance",
        children: <Typography.Text>Connect a NEAR wallet and try again.</Typography.Text>,
      });
    }

    try {
      const contract = await FungibleTokenContract.loadFromWalletConnection(
        wallet.context.get().connection!,
        contractAddress,
      );

      const balance = await contract.ftBalanceOf({ account_id: wallet.address.get()! });
      const metadata = await contract.ftMetadata();

      if (!metadata) {
        return balance;
      }

      return (Number(balance) / Number("1".padEnd(metadata.decimals + 1, "0"))).toFixed(
        currency.constants.DEFAULT_DECIMALS_PRECISION,
      );
    } catch {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Failed to fetch collateral token balance",
        children: <Typography.Text>Check your internet connection and try again.</Typography.Text>,
      });
    }

    return "0.00";
  };

  const ftTransferCall = async (
    contractAddress: AccountId,
    receiverId: AccountId,
    // @TODO amount might need to be converted to collateral token precision decimals since it won't accept floats
    amount: string,
    outcomeId: OutcomeId,
  ) => {
    if (!wallet.isConnected.get()) {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Failed to make transfer call",
        children: <Typography.Text>Connect a NEAR wallet and try again.</Typography.Text>,
      });
    }

    try {
      const contract = await FungibleTokenContract.loadFromWalletConnection(
        wallet.context.get().connection!,
        contractAddress,
      );

      const msg = JSON.stringify({ BuyArgs: { outcome_id: outcomeId } });

      await contract.ftTransferCall({ receiver_id: receiverId, amount, msg });
    } catch {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Failed to make transfer call",
        children: <Typography.Text>Check your internet connection and try again.</Typography.Text>,
      });
    }
  };

  return {
    contract: FungibleTokenContract,
    getWalletBalance,
    ftTransferCall,
  };
};
