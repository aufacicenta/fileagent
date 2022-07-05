import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";

import { MarketCardContainerProps } from "./MarketCard.types";
import { MarketCard } from "./MarketCard";
import { MarketCardTemplate } from "./MarketCardTemplate";

// @TODO redirect to market page
const onClickOutcomeToken = () => undefined;

export const MarketCardContainer: React.FC<MarketCardContainerProps> = ({ className, expanded, marketId }) => {
  const { marketContractValues, onClickPublishMarket } = useNearMarketContract({ marketId });

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
