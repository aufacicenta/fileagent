import { useState } from "react";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { Typography } from "ui/typography/Typography";
import { AccountId, OutcomeId } from "../market/market.types";
import currency from "providers/currency";

import { FungibleTokenContract } from ".";
import { FungibleTokenMetadata } from "./fungible-token.types";

export default () => {
  const [fungibleTokenMetadata, setFungibleTokenMetadata] = useState<FungibleTokenMetadata | undefined>();

  const toast = useToastContext();
  const wallet = useWalletStateContext();

  const assertWalletConnection = () => {
    if (!wallet.isConnected.get()) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_WALLET_CONNECTION");
    }
  };

  const getWalletBalance = async (contractAddress: AccountId) => {
    try {
      assertWalletConnection();

      const contract = await FungibleTokenContract.loadFromWalletConnection(
        wallet.context.get().connection!,
        contractAddress,
      );

      const balance = await contract.ftBalanceOf({ account_id: wallet.address.get()! });
      const metadata = await contract.ftMetadata();

      if (!metadata) {
        return balance;
      }

      setFungibleTokenMetadata(metadata);

      return currency.convert.toDecimalsPrecisionString(balance, metadata.decimals);
    } catch {
      return "0.00";
    }
  };

  const getBalanceOf = async (contractAddress: AccountId, accountId: AccountId) => {
    try {
      const contract = await FungibleTokenContract.loadFromGuestConnection(contractAddress);

      const balance = await contract.ftBalanceOf({ account_id: accountId });
      const metadata = await contract.ftMetadata();

      if (!metadata) {
        return balance;
      }

      return currency.convert.toDecimalsPrecisionString(balance, metadata.decimals);
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
    amount: number,
    outcomeId: OutcomeId,
  ) => {
    try {
      assertWalletConnection();

      const contract = await FungibleTokenContract.loadFromWalletConnection(
        wallet.context.get().connection!,
        contractAddress,
      );

      const metadata = await contract.ftMetadata();

      if (!metadata) {
        throw new Error("ERR_FT_TRANSFER_CALL_FT_METADATA");
      }

      const uintAmount = currency.convert.toUIntAmount(amount, metadata.decimals);

      const msg = JSON.stringify({ BuyArgs: { outcome_id: outcomeId } });

      await contract.ftTransferCall({ receiver_id: receiverId, amount: uintAmount.toString(), msg });
    } catch {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Failed to make transfer call",
        children: <Typography.Text>Check your internet connection, connect your wallet and try again.</Typography.Text>,
      });
    }
  };

  return {
    contract: FungibleTokenContract,
    getWalletBalance,
    getBalanceOf,
    ftTransferCall,
    fungibleTokenMetadata,
  };
};
