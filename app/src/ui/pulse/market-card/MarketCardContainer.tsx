import { useEffect, useState } from "react";

import { Typography } from "ui/typography/Typography";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { MarketContractValues, OutcomeToken } from "providers/near/contracts/market/market.types";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";

import { MarketCardContainerProps } from "./MarketCard.types";
import { MarketCard } from "./MarketCard";
import { MarketCardTemplate } from "./MarketCardTemplate";

export const MarketCardContainer: React.FC<MarketCardContainerProps> = ({ className, expanded, marketId }) => {
  const [marketContractValues, setMarketContractValues] = useState<MarketContractValues>();

  const toast = useToastContext();
  const wallet = useWalletStateContext();
  const { contract: MarketContract } = useNearMarketContract();

  useEffect(() => {
    (async () => {
      try {
        const contract = await MarketContract.loadFromGuestConnection(marketId);
        const market = await contract.getMarketData();
        const resolutionWindow = await contract.getResolutionWindow();
        const isPublished = await contract.isPublished();

        if (!market || !resolutionWindow) {
          throw new Error("Failed to fetch market data");
        }

        const outcomeTokens = !isPublished
          ? undefined
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
          outcomeTokens: outcomeTokens as Array<OutcomeToken>,
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

  if (!marketContractValues) {
    return <MarketCardTemplate expanded={expanded} />;
  }

  return (
    <MarketCard
      expanded={expanded}
      marketContractValues={marketContractValues}
      className={className}
      onClickPublishMarket={onClickPublishMarket}
    />
  );
};
