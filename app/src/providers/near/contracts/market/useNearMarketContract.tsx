import { useEffect, useState } from "react";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";

import { MarketContract } from ".";
import { AccountId, MarketContractValues, OutcomeToken } from "./market.types";

export default ({ marketId }: { marketId: AccountId }) => {
  const [marketContractValues, setMarketContractValues] = useState<MarketContractValues>();

  const toast = useToastContext();
  const wallet = useWalletStateContext();

  useEffect(() => {
    (async () => {
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
    })();
  }, [marketId, toast]);

  const onClickPublishMarket = async () => {
    // @TODO check if wallet is connected or display wallet connect modal
    try {
      await MarketContract.publish(wallet.context.get().connection!, marketId);
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        // @TODO i18n
        title: "Failed to publish market",
        children: <Typography.Text>Check your internet connection, your NEAR balance and try again.</Typography.Text>,
      });
    }
  };

  return {
    contract: MarketContract,
    marketContractValues,
    onClickPublishMarket,
  };
};
