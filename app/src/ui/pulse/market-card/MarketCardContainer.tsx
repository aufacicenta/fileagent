import { Typography } from "ui/typography/Typography";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";

import { MarketCardContainerProps } from "./MarketCard.types";
import { MarketCard } from "./MarketCard";
import { MarketCardTemplate } from "./MarketCardTemplate";

// @TODO redirect to market page
const onClickOutcomeToken = () => undefined;

export const MarketCardContainer: React.FC<MarketCardContainerProps> = ({ className, expanded, marketId }) => {
  const toast = useToastContext();
  const wallet = useWalletStateContext();
  const { marketContractValues, contract: MarketContract } = useNearMarketContract({ marketId });

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
      onClickOutcomeToken={onClickOutcomeToken}
    />
  );
};
