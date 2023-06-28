import React, { useState } from "react";
import { setTimeout } from "timers";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { PromptWarsMarketContract } from "providers/near/contracts/prompt-wars/contract";
import {
  PromptWarsMarketContractStatus,
  PromptWarsMarketContractValues,
} from "providers/near/contracts/prompt-wars/prompt-wars.types";

import { NearPromptWarsMarketContractContext } from "./NearPromptWarsMarketContractContext";
import {
  NearPromptWarsMarketContractContextContextActions,
  NearPromptWarsMarketContractContextControllerProps,
} from "./NearPromptWarsMarketContractContextContext.types";

export const NearPromptWarsMarketContractContextController = ({
  children,
  marketId,
}: NearPromptWarsMarketContractContextControllerProps) => {
  const [marketContractValues, setMarketContractValues] = useState<PromptWarsMarketContractValues>();
  const [actions, setActions] = useState<NearPromptWarsMarketContractContextContextActions>({
    fetchMarketContractValues: {
      isLoading: false,
    },
  });

  const toast = useToastContext();
  // const walletState = useWalletStateContext();

  // Open for submissions, revealing, resolving, claim fees, destroy
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
      }, 1000);
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
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

  // const assertWalletConnection = () => {
  //   if (!walletState.isConnected) {
  //     toast.trigger({
  //       variant: "info",
  //       withTimeout: true,
  //       // @TODO i18n
  //       title: "Wallet is not connected",
  //       children: <Typography.Text>Check your internet connection, your NEAR balance and try again.</Typography.Text>,
  //     });

  //     throw new Error("ERR_USE_NEAR_MARKET_CONTRACT_INVALID_WALLET_CONNECTION");
  //   }
  // };

  // const getBalanceOf = async (outcome_id: OutcomeId) => {
  //   try {
  //     const contract = await PromptWarsMarketContract.loadFromGuestConnection(marketId);
  //     const balance = await contract.balanceOf(outcome_id);

  //     return balance;
  //   } catch {
  //     return 0;
  //   }
  // };

  // const getAmountMintable = async () => {
  //   try {
  //     assertWalletConnection();

  //     const [contract] = await PromptWarsMarketContract.loadFromWalletConnection(walletState.context.connection!, marketId);
  //     const balance = await contract.getAmountMintable();

  //     return balance;
  //   } catch {
  //     toast.trigger({
  //       variant: "error",
  //       withTimeout: true,
  //       // @TODO i18n
  //       title: "Failed to fetch amount mintable",
  //       children: (
  //         <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
  //       ),
  //     });
  //   }

  //   return [0, 0, 0, 0, 0];
  // };

  // const getAmountPayableResolved = async (args: GetAmountPayableArgs) => {
  //   try {
  //     assertWalletConnection();

  //     const [contract] = await PromptWarsMarketContract.loadFromWalletConnection(walletState.context.connection!, marketId);
  //     const balance = await contract.getAmountPayableResolved(args);

  //     return balance;
  //   } catch {
  //     toast.trigger({
  //       variant: "error",
  //       withTimeout: true,
  //       // @TODO i18n
  //       title: "Failed to fetch amount payable",
  //       children: (
  //         <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
  //       ),
  //     });
  //   }

  //   return [0, 0];
  // };

  // const getAmountPayableUnresolved = async (args: GetAmountPayableArgs) => {
  //   try {
  //     assertWalletConnection();

  //     const [contract] = await PromptWarsMarketContract.loadFromWalletConnection(walletState.context.connection!, marketId);
  //     const balance = await contract.getAmountPayableUnresolved(args);

  //     return balance;
  //   } catch {
  //     toast.trigger({
  //       variant: "error",
  //       withTimeout: true,
  //       // @TODO i18n
  //       title: "Failed to fetch amount payable",
  //       children: (
  //         <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
  //       ),
  //     });
  //   }

  //   return [0, 0];
  // };

  // const sell = async (args: SellArgs) => {
  //   try {
  //     assertWalletConnection();

  //     await PromptWarsMarketContract.sell(walletState.context.wallet!, marketId, args);

  //     toast.trigger({
  //       variant: "confirmation",
  //       withTimeout: false,
  //       // @TODO i18n
  //       title: "Success",
  //       children: (
  //         <Typography.Text>{`Sold ${currency.convert.toDecimalsPrecisionString(
  //           args.amount,
  //           marketContractValues?.collateralTokenMetadata?.decimals!,
  //         )} of "${marketContractValues?.market.options[args.outcome_id]}"`}</Typography.Text>
  //       ),
  //     });
  //   } catch {
  //     toast.trigger({
  //       variant: "error",
  //       withTimeout: true,
  //       // @TODO i18n
  //       title: "Failed to call sell method",
  //       children: (
  //         <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
  //       ),
  //     });
  //   }
  // };

  const props = {
    fetchMarketContractValues,
    marketContractValues,
    // getBalanceOf,
    // getAmountMintable,
    // getAmountPayableResolved,
    // getAmountPayableUnresolved,
    // sell,
    actions,
    marketId,
  };

  return (
    <NearPromptWarsMarketContractContext.Provider value={props}>
      {children}
    </NearPromptWarsMarketContractContext.Provider>
  );
};
