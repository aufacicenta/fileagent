import { useEffect, useState } from "react";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import currency from "providers/currency";
import date from "providers/date";

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

  const fetchMarketContractValues = async () => {
    try {
      const contract = await MarketContract.loadFromGuestConnection(marketId);
      const market = await contract.getMarketData();
      const price = await contract.getPricingData();
      const resolutionWindow = await contract.getResolutionWindow();
      const buySellTimestamp = await contract.getBuySellTimestamp();
      const isOver = await contract.isOver();
      const isOpen = await contract.isOpen();
      const isResolutionWindowExpired = await contract.isResolutionWindowExpired();
      const isResolved = await contract.isResolved();
      const collateralTokenMetadata = await contract.getCollateralTokenMetadata();
      const feeRatio = await contract.getFeeRatio();
      const resolution = await contract.getResolutionData();

      if (!market || !collateralTokenMetadata || !feeRatio) {
        throw new Error("Failed to fetch market data");
      }

      if (price) {
        market.description = `Will ${price.base_currency_symbol} be above ${currency.convert.toFormattedString(
          price.value,
        )}?`;
      }

      const outcomeTokens = (
        await Promise.all(
          market.options.map((_option, outcomeId) => contract.getOutcomeToken({ outcome_id: outcomeId })),
        )
      ).filter(Boolean);

      if (!outcomeTokens) {
        throw new Error("Failed to fetch outcome tokens data");
      }

      setMarketContractValues({
        market,
        resolutionWindow,
        isOver,
        isResolved,
        isOpen,
        isResolutionWindowExpired,
        collateralTokenMetadata,
        outcomeTokens: outcomeTokens as Array<OutcomeToken>,
        feeRatio,
        buySellTimestamp,
        resolution: {
          ...resolution,
          // @TODO set to actual feed_id from current contract
          feed_id: "CfHFMUiP8BbTGkt9AvTFYzVPgoNxCz16zPD6huoRUwUB",
        },
        price,
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
  };

  const updatePriceMarketDescription = async () => {
    const market = marketContractValues?.market;
    const price = marketContractValues?.price;

    if (!market || !price) {
      return;
    }

    market.description =
      date.now().valueOf() > date.client(date.fromNanoseconds(market.ends_at)).valueOf()
        ? `Will ${price.base_currency_symbol} be above ${currency.convert.toFormattedString(price.value)}?`
        : `Will ${price.base_currency_symbol} be above ${currency.convert.toFormattedString(
            price.value,
          )} ${date.timeFromNow.asDefault(date.fromNanoseconds(market.ends_at))}?`;

    setMarketContractValues((prev) => ({
      ...prev!,
      price,
    }));
  };

  useEffect(() => {
    if (!preventLoad) {
      fetchMarketContractValues();
    }
  }, [marketId, preventLoad]);

  useEffect(() => {
    if (!marketContractValues?.price) {
      return undefined;
    }

    const interval = setInterval(async () => {
      updatePriceMarketDescription();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [marketContractValues?.price]);

  const assertWalletConnection = () => {
    if (!wallet.isConnected) {
      toast.trigger({
        variant: "info",
        withTimeout: true,
        // @TODO i18n
        title: "Wallet is not connected",
        children: <Typography.Text>Check your internet connection, your NEAR balance and try again.</Typography.Text>,
      });

      throw new Error("ERR_USE_NEAR_MARKET_CONTRACT_INVALID_WALLET_CONNECTION");
    }
  };

  const getBalanceOf = async ({ outcome_id }: Omit<BalanceOfArgs, "account_id">) => {
    // @TODO check if wallet is connected or display wallet connect modal
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.connection!, marketId);
      const balance = await contract.balanceOf({ outcome_id, account_id: wallet.address! });

      return balance;
    } catch {
      return 0;
    }
  };

  const getAmountMintable = async (args: GetAmountMintableArgs) => {
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.connection!, marketId);
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

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.connection!, marketId);
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

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.connection!, marketId);
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

  const onClickResolveMarket = async () => {
    // @TODO check if wallet is connected or display wallet connect modal
    try {
      assertWalletConnection();

      const [contract] = await MarketContract.loadFromWalletConnection(wallet.context.connection!, marketId);
      const result = await contract.aggregator_read();

      return result;
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to publish market",
        children: <Typography.Text>Check your internet connection, your NEAR balance and try again.</Typography.Text>,
      });

      return false;
    }
  };

  return {
    contract: MarketContract,
    marketContractValues,
    fetchMarketContractValues,
    getBalanceOf,
    getAmountMintable,
    getAmountPayable,
    sell,
    onClickResolveMarket,
  };
};
