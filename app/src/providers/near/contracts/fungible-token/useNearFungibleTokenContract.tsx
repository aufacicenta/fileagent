import { useEffect, useState } from "react";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { Typography } from "ui/typography/Typography";
import { AccountId, OutcomeId } from "../market/market.types";
import currency from "providers/currency";

import { FungibleTokenContract } from ".";
import { FungibleTokenMetadata } from "./fungible-token.types";

export default ({ contractAddress }: { contractAddress?: string }) => {
  const [metadata, setMetadata] = useState<FungibleTokenMetadata>();
  const [contract, setContract] = useState<FungibleTokenContract>();

  const toast = useToastContext();
  const wallet = useWalletStateContext();
  const { connection } = wallet.context;

  const assertWalletConnection = () => {
    if (!wallet.isConnected) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_WALLET_CONNECTION");
    }
  };

  const assertContractConnection = () => {
    if (!contract) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_CONTRACT_CONNECTION");
    }
  };

  const assertContractMetadata = () => {
    if (!metadata) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_CONTRACT_METADATA");
    }
  };

  const loadContract = async () => {
    try {
      if (!contractAddress) {
        throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_CONTRACT_ADDRESS");
      }

      if (wallet.isConnected) {
        setContract(await FungibleTokenContract.loadFromWalletConnection(wallet.context.connection!, contractAddress));
      } else {
        setContract(await FungibleTokenContract.loadFromGuestConnection(contractAddress));
      }
    } catch {
      // void
    }
  };

  const getFtMetadata = async () => {
    try {
      if (!contract) {
        return;
      }

      const ftMetadata = await contract.ftMetadata();

      setMetadata(ftMetadata);
    } catch {
      // void
    }
  };

  useEffect(() => {
    loadContract();
  }, [connection, contractAddress]);

  useEffect(() => {
    getFtMetadata();
  }, [contract]);

  const getWalletBalance = async () => {
    try {
      assertWalletConnection();
      assertContractConnection();
      assertContractMetadata();

      const balance = await contract!.ftBalanceOf({ account_id: wallet.address! });

      return currency.convert.toDecimalsPrecisionString(balance, metadata!.decimals);
    } catch {
      return "0.00";
    }
  };

  const getBalanceOf = async (accountId: AccountId) => {
    try {
      assertContractConnection();
      assertContractMetadata();

      const balance = await contract!.ftBalanceOf({ account_id: accountId });

      return currency.convert.toDecimalsPrecisionString(balance, metadata!.decimals);
    } catch {
      return "0.00";
    }
  };

  const ftTransferCall = async (receiverId: AccountId, amount: string, outcomeId: OutcomeId) => {
    try {
      assertWalletConnection();
      assertContractConnection();

      if (!metadata) {
        throw new Error("ERR_FT_TRANSFER_CALL_FT_METADATA");
      }

      const msg = JSON.stringify({ BuyArgs: { outcome_id: outcomeId } });

      await contract!.ftTransferCall({ receiver_id: receiverId, amount, msg });
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
    metadata,
  };
};
