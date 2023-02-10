/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from "react";

import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import date from "providers/date";
import { DeployMarketContractArgs } from "providers/near/contracts/market-factory/market-factory.types";
import near from "providers/near";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";
import pulse from "providers/pulse";
import switchboard from "providers/switchboard";
import { DEFAULT_FEE_RATIO } from "providers/near/getConfig";

import { NearMarketFactoryContractContextControllerProps } from "./NearMarketFactoryContractContext.types";
import { NearMarketFactoryContractContext } from "./NearMarketFactoryContractContext";

export const NearMarketFactoryContractContextController = ({
  children,
}: NearMarketFactoryContractContextControllerProps) => {
  const [marketId, setMarketId] = useState("");

  const toast = useToastContext();
  const walletState = useWalletStateContext();

  const assertWalletConnection = () => {
    if (!walletState.isConnected) {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Wallet is not connected",
        children: <Typography.Text>Check your internet connection, your NEAR balance and try again.</Typography.Text>,
      });

      throw new Error("ERR_MARKET_FACTORY_WALLET_IS_NOT_CONNECTED");
    }
  };

  const fetchLatestPriceMarket = async () => {
    try {
      const marketFactory = await MarketFactoryContract.loadFromGuestConnection();
      const marketsList = await marketFactory.getMarketsList();

      if (!marketsList) {
        throw new Error("ERR_FAILED_TO_FETCH_MARKETS");
      }

      const latestMarketId = marketsList.pop();

      if (!latestMarketId) {
        throw new Error("ERR_MARKET_FACTORY_HAS_NO_MARKETS");
      }

      setMarketId(latestMarketId);
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to fetch recent markets",
        children: <Typography.Text>Try refreshing the page, or check your internet connection.</Typography.Text>,
      });
    }
  };

  const createMarket = async (args: DeployMarketContractArgs) => {
    try {
      assertWalletConnection();

      const contractAddress = near.getConfig().marketFactoryAccountId;
      const contract = new MarketFactoryContract(contractAddress, undefined, walletState.context.wallet);

      await contract.createMarket(args);
    } catch (error) {
      console.log(error);
    }
  };

  const createPriceMarket = async () => {
    try {
      assertWalletConnection();

      const contractAddress = near.getConfig().marketFactoryAccountId;
      const contract = new MarketFactoryContract(contractAddress, undefined, walletState.context.wallet);

      const timezoneOffset = 0;

      const starts_at = date.now().utcOffset(timezoneOffset);
      const ends_at = starts_at.clone().add(15, "minutes");

      const dao_account_id = near.getConfig().marketDaoAccountId;

      const collateralToken = pulse.getConfig().COLLATERAL_TOKENS[0];

      const resolutionWindow = ends_at.clone().add(5, "minutes");

      // @TODO set to the corresponding Switchboard aggregator feed address
      const ix = {
        address: [
          173, 62, 255, 125, 45, 251, 162, 167, 128, 129, 25, 33, 146, 248, 118, 134, 118, 192, 215, 84, 225, 222, 198,
          48, 70, 49, 212, 195, 84, 136, 96, 56,
        ],
      };

      const current_price = (await switchboard.fetchCurrentPrice(switchboard.jobs.testnet.near.btcUsd)).toFixed(2);

      const args: DeployMarketContractArgs = {
        market: {
          description: "",
          info: "",
          category: "crypto",
          options: ["yes", "no"],
          starts_at: date.toNanoseconds(starts_at.valueOf()),
          ends_at: date.toNanoseconds(ends_at.valueOf()),
          utc_offset: timezoneOffset,
        },
        collateral_token: {
          id: collateralToken.accountId,
          decimals: collateralToken.decimals,
          balance: 0,
          fee_balance: 0,
        },
        fees: {
          // 2% of 6 precision decimals
          fee_ratio: DEFAULT_FEE_RATIO,
        },
        resolution: {
          window: date.toNanoseconds(resolutionWindow.valueOf()),
          ix,
        },
        management: {
          dao_account_id,
        },
        price: {
          value: Number(current_price),
          base_currency_symbol: "BTC",
          target_currency_symbol: "USD",
        },
      };

      await contract.createMarket(args);

      await fetchLatestPriceMarket();
    } catch (error) {
      console.log(error);
    }
  };

  const props = {
    fetchLatestPriceMarket,
    createMarket,
    createPriceMarket,
    marketId,
  };

  return (
    <NearMarketFactoryContractContext.Provider value={props}>{children}</NearMarketFactoryContractContext.Provider>
  );
};
