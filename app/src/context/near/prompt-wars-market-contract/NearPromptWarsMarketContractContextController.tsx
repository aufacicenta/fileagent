import React, { useState } from "react";
import { setTimeout } from "timers";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { PromptWarsMarketContract } from "providers/near/contracts/prompt-wars/contract";
import {
  Prompt,
  PromptWarsMarketContractStatus,
  PromptWarsMarketContractValues,
} from "providers/near/contracts/prompt-wars/prompt-wars.types";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { FungibleTokenContract } from "providers/near/contracts/fungible-token";
import currency from "providers/currency";

import {
  NearPromptWarsMarketContractContextContextActions,
  NearPromptWarsMarketContractContextControllerProps,
} from "./NearPromptWarsMarketContractContextContext.types";
import { NearPromptWarsMarketContractContext } from "./NearPromptWarsMarketContractContext";

export const NearPromptWarsMarketContractContextController = ({
  children,
  marketId,
}: NearPromptWarsMarketContractContextControllerProps) => {
  const [marketContractValues, setMarketContractValues] = useState<PromptWarsMarketContractValues>();
  const [actions, setActions] = useState<NearPromptWarsMarketContractContextContextActions>({
    fetchMarketContractValues: {
      isLoading: false,
    },
    ftTransferCall: {
      isLoading: false,
    },
  });

  const toast = useToastContext();
  const walletState = useWalletStateContext();

  const getMarketStatus = (values: PromptWarsMarketContractValues): PromptWarsMarketContractStatus => {
    if (!values) {
      return PromptWarsMarketContractStatus.LOADING;
    }

    if (values?.isOpen) {
      return PromptWarsMarketContractStatus.OPEN;
    }

    if (values?.isOver && !values.isRevealWindowExpired) {
      return PromptWarsMarketContractStatus.REVEALING;
    }

    if (values?.isOver && !values.isResolutionWindowExpired) {
      return PromptWarsMarketContractStatus.RESOLVING;
    }

    if (values?.isOver && values.isResolutionWindowExpired && values.isResolved) {
      return PromptWarsMarketContractStatus.RESOLVED;
    }

    if (values?.isOver && values.isExpiredUnresolved) {
      return PromptWarsMarketContractStatus.UNRESOLVED;
    }

    return PromptWarsMarketContractStatus.CLOSED;
  };

  const fetchMarketContractValues = async () => {
    setActions((prev) => ({
      ...prev,
      fetchMarketContractValues: {
        isLoading: true,
      },
    }));

    try {
      // Wait 1 second to allow flags to change
      setTimeout(async () => {
        try {
          const contract = await PromptWarsMarketContract.loadFromGuestConnection(marketId);

          const [
            market,
            resolution,
            fees,
            management,
            collateralToken,
            outcomeIds,
            isResolved,
            isOpen,
            isOver,
            isRevealWindowExpired,
            isResolutionWindowExpired,
            isExpiredUnresolved,
            isClaimingWindowExpired,
          ] = await Promise.all([
            contract.get_market_data(),
            contract.get_resolution_data(),
            contract.get_fee_data(),
            contract.get_management_data(),
            contract.get_collateral_token_metadata(),
            contract.get_outcome_ids(),
            contract.is_resolved(),
            contract.is_open(),
            contract.is_over(),
            contract.is_reveal_window_expired(),
            contract.is_resolution_window_expired(),
            contract.is_expired_unresolved(),
            contract.is_claiming_window_expired(),
          ]);

          const values: PromptWarsMarketContractValues = {
            market,
            resolution,
            fees,
            management,
            collateralToken,
            outcomeIds,
            isResolved,
            isOpen,
            isOver,
            isRevealWindowExpired,
            isResolutionWindowExpired,
            isExpiredUnresolved,
            isClaimingWindowExpired,
            status: PromptWarsMarketContractStatus.LOADING,
          };

          const status = getMarketStatus(values);

          values.status = status;

          setMarketContractValues(values);
        } catch (error) {
          console.log(error);
        }
      }, 1000);
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        title: "Failed to fetch market data",
        children: <Typography.Text>Try refreshing the page, or check your internet connection.</Typography.Text>,
      });
    }

    setActions((prev) => ({
      ...prev,
      fetchMarketContractValues: {
        isLoading: false,
      },
    }));
  };

  const assertWalletConnection = () => {
    if (!walletState.isConnected) {
      toast.trigger({
        variant: "info",
        withTimeout: true,
        title: "Wallet is not connected",
        children: <Typography.Text>Check your internet connection, your NEAR balance and try again.</Typography.Text>,
      });

      throw new Error("ERR_USE_NEAR_MARKET_CONTRACT_INVALID_WALLET_CONNECTION");
    }
  };

  const ftTransferCall = async (prompt: Prompt) => {
    if (!marketContractValues) {
      return;
    }

    try {
      assertWalletConnection();

      setActions((prev) => ({
        ...prev,
        ftTransferCall: {
          ...prev.ftTransferCall,
          isLoading: true,
        },
      }));

      const amount = marketContractValues.fees.price.toString();
      const msg = JSON.stringify({ CreateOutcomeTokenArgs: { prompt: JSON.stringify(prompt) } });

      await FungibleTokenContract.ftTransferCall(
        walletState.context.wallet!,
        marketContractValues.collateralToken.id!,
        {
          receiver_id: marketId,
          amount,
          msg,
        },
      );

      toast.trigger({
        variant: "confirmation",
        withTimeout: false,
        title: "Your prompt was successfully submitted",
        children: (
          <Typography.Text>{`Transferred USDT ${currency.convert.toDecimalsPrecisionString(
            amount,
            marketContractValues.collateralToken.decimals!,
          )} to ${marketId}`}</Typography.Text>
        ),
      });

      fetchMarketContractValues();
    } catch {
      toast.trigger({
        variant: "error",
        title: "Failed to make transfer call",
        children: <Typography.Text>Check your internet connection, connect your wallet and try again.</Typography.Text>,
      });
    }
  };

  const sell = async () => {
    try {
      assertWalletConnection();

      await PromptWarsMarketContract.sell(walletState.context.wallet!, marketId);

      toast.trigger({
        variant: "confirmation",
        withTimeout: false,
        title: "Success",
        children: <Typography.Text>Check your new wallet balance.</Typography.Text>,
      });
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        title: "Failed to call sell method",
        children: (
          <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
        ),
      });
    }
  };

  const props = {
    fetchMarketContractValues,
    marketContractValues,
    ftTransferCall,
    sell,
    actions,
    marketId,
  };

  return (
    <NearPromptWarsMarketContractContext.Provider value={props}>
      {children}
    </NearPromptWarsMarketContractContext.Provider>
  );
};
