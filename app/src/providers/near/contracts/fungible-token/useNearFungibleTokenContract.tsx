import { useEffect, useState } from "react";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { Typography } from "ui/typography/Typography";
import { AccountId, OutcomeId } from "../market/market.types";
import currency from "providers/currency";
import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";

import { FungibleTokenContract } from ".";
import { FungibleTokenMetadata } from "./fungible-token.types";

export default ({ contractAddress }: { contractAddress?: string }) => {
  const [actions, setActions] = useState<{ ftTransferCall: { isLoading: boolean } }>({
    ftTransferCall: {
      isLoading: false,
    },
  });
  const [metadata, setMetadata] = useState<FungibleTokenMetadata>();
  const [guestContract, setGuestContract] = useState<FungibleTokenContract>();

  const toast = useToastContext();
  const walletState = useWalletStateContext();
  const { connection } = walletState.context;
  const { marketContractValues } = useNearMarketContractContext();

  const assertWalletConnection = () => {
    if (!walletState.isConnected) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_WALLET_CONNECTION");
    }
  };

  const assertGuestContractConnection = () => {
    if (!guestContract) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_GUEST_CONTRACT_CONNECTION");
    }
  };

  const assertContractMetadata = () => {
    if (!metadata) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_CONTRACT_METADATA");
    }
  };

  const assertContractAddress = () => {
    if (!contractAddress) {
      throw new Error("ERR_USE_NEAR_FT_CONTRACT_INVALID_CONTRACT_ADDRESS");
    }
  };

  const loadGuestContract = async () => {
    try {
      assertContractAddress();

      setGuestContract(await FungibleTokenContract.loadFromGuestConnection(contractAddress!));
    } catch {
      // void
    }
  };

  const getFtMetadata = async () => {
    try {
      assertGuestContractConnection();

      const ftMetadata = await guestContract!.ftMetadata();

      setMetadata(ftMetadata);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadGuestContract();
  }, [connection, contractAddress]);

  useEffect(() => {
    if (!guestContract) {
      return;
    }

    getFtMetadata();
  }, [guestContract]);

  const getWalletBalance = async () => {
    try {
      assertWalletConnection();
      assertGuestContractConnection();
      assertContractMetadata();

      const balance = await guestContract!.ftBalanceOf({ account_id: walletState.address! });

      return currency.convert.toDecimalsPrecisionString(balance, metadata!.decimals);
    } catch {
      return "0.00";
    }
  };

  const getBalanceOf = async (accountId: AccountId) => {
    try {
      assertGuestContractConnection();
      assertContractMetadata();

      const balance = await guestContract!.ftBalanceOf({ account_id: accountId });

      return currency.convert.toDecimalsPrecisionString(balance, metadata!.decimals);
    } catch {
      return "0.00";
    }
  };

  const ftTransferCall = async (receiverId: AccountId, amount: string, outcomeId: OutcomeId) => {
    try {
      assertWalletConnection();
      assertContractAddress();

      setActions((prev) => ({
        ...prev,
        ftTransferCall: {
          ...prev.ftTransferCall,
          isLoading: true,
        },
      }));

      const msg = JSON.stringify({ BuyArgs: { outcome_id: outcomeId } });

      await FungibleTokenContract.ftTransferCall(walletState.context.wallet!, contractAddress!, {
        receiver_id: receiverId,
        amount,
        msg,
      });

      toast.trigger({
        variant: "confirmation",
        withTimeout: false,
        // @TODO i18n
        title: "Your bet was made successfully",
        children: (
          <Typography.Text>{`Bought ${currency.convert.toDecimalsPrecisionString(amount, metadata?.decimals!)} ${
            metadata?.symbol
          } of "${marketContractValues?.market.options[outcomeId]}"`}</Typography.Text>
        ),
      });
    } catch {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Failed to make transfer call",
        children: <Typography.Text>Check your internet connection, connect your wallet and try again.</Typography.Text>,
      });
    }

    setActions((prev) => ({
      ...prev,
      ftTransferCall: {
        ...prev.ftTransferCall,
        isLoading: false,
      },
    }));
  };

  return {
    contract: FungibleTokenContract,
    getWalletBalance,
    getBalanceOf,
    ftTransferCall,
    metadata,
    actions,
  };
};
