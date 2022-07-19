import { useCallback, useEffect, useState } from "react";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";

import { MarketContract } from ".";
import {
  AccountId,
  BalanceOfArgs,
  GetAmountMintableArgs,
  GetAmountPayableArgs,
  MarketContractValues,
  OutcomeToken,
  SellArgs,
} from "./market.types";

export default ({ marketId, preventLoad = false }: { marketId: AccountId; preventLoad?: boolean }) => {
  const [marketContractValues, setMarketContractValues] = useState<MarketContractValues>();

  const toast = useToastContext();
  const wallet = useWalletStateContext();

  const fetchMarketContractValues = useCallback(async () => {
    try {
      const contract = await MarketContract.loadFromGuestConnection(marketId);
      const market = await contract.getMarketData();
      const resolutionWindow = await contract.getResolutionWindow();
      const isPublished = await contract.isPublished();
      const collateralTokenMetadata = await contract.getCollateralTokenMetadata();
      const feeRatio = await contract.getFeeRatio();

      if (!market || !resolutionWindow || !collateralTokenMetadata || !feeRatio) {
        throw new Error("Failed to fetch market data");
      }

      const outcomeTokens = !isPublished
        ? []
        : (
            await Promise.all(
              market.options.map((_option, outcomeId) => contract.getOutcomeToken({ outcome_id: outcomeId })),
            )
          ).filter(Boolean);

      if (isPublished && !outcomeTokens) {
        throw new Error("Failed to fetch outcome tokens data");
      }

      setMarketContractValues({
        market,
        resolutionWindow,
        isPublished,
        collateralTokenMetadata,
        outcomeTokens: outcomeTokens as Array<OutcomeToken>,
        feeRatio,
      });
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to fetch market data",
        children: <Typography.Text>Try refreshing the page, or check your internet connection.</Typography.Text>,
      });
    }
  }, [marketId, toast]);

  useEffect(() => {
    if (!preventLoad) {
      fetchMarketContractValues();
    }
  }, [fetchMarketContractValues, preventLoad]);

  const assertWalletConnection = () => {
    if (!wallet.isConnected.get()) {
      throw new Error("ERR_USE_NEAR_MARKET_CONTRACT_INVALID_WALLET_CONNECTION");
    }
  };

  const onClickPublishMarket = async () => {
    // @TODO check if wallet is connected or display wallet connect modal
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.get().connection!, marketId);
      const result = await contract.publish();

      return result;
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to publish market",
        children: <Typography.Text>Check your internet connection, your NEAR balance and try again.</Typography.Text>,
      });
    }

    return false;
  };

  const getBalanceOf = async ({ outcome_id }: Omit<BalanceOfArgs, "account_id">) => {
    // @TODO check if wallet is connected or display wallet connect modal
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.get().connection!, marketId);
      const balance = await contract.balanceOf({ outcome_id, account_id: wallet.address.get()! });

      return balance;
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to fetch outcome token balance",
        children: (
          <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
        ),
      });
    }

    return 0;
  };

  const getAmountMintable = async (args: GetAmountMintableArgs) => {
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.get().connection!, marketId);
      const balance = await contract.getAmountMintable(args);

      return balance;
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to fetch amount mintable",
        children: (
          <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
        ),
      });
    }

    return [0, 0, 0, 0, 0];
  };

  const getAmountPayable = async (args: GetAmountPayableArgs) => {
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.get().connection!, marketId);
      const balance = await contract.getAmountPayable(args);

      return balance;
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to fetch amount payable",
        children: (
          <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
        ),
      });
    }

    return [0, 0];
  };

  const sell = async (args: SellArgs) => {
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.get().connection!, marketId);
      await contract.sell(args);
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to call sell method",
        children: (
          <Typography.Text>Check your internet connection, your NEAR wallet connection and try again.</Typography.Text>
        ),
      });
    }
  };

  return {
    contract: MarketContract,
    marketContractValues,
    onClickPublishMarket,
    fetchMarketContractValues,
    getBalanceOf,
    getAmountMintable,
    getAmountPayable,
    sell,
  };
};
