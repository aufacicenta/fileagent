import useNearMarketContract from "providers/near/contracts/market/useNearMarketContract";

import { MarketCardContainerProps } from "./MarketCard.types";
import { MarketCard } from "./MarketCard";
import { MarketCardTemplate } from "./MarketCardTemplate";

export const MarketCardContainer: React.FC<MarketCardContainerProps> = ({
  className,
  expanded,
  marketId,
  onClickOutcomeToken,
  onClickMarketTitle,
}) => {
  const { marketContractValues, onClickPublishMarket } = useNearMarketContract({ marketId });

  if (!marketContractValues) {
    return <MarketCardTemplate expanded={expanded} />;
  }

  return (
    <MarketCard
      expanded={expanded}
      marketContractValues={marketContractValues}
      className={className}
      onClickResolveMarket={onClickPublishMarket}
      onClickOutcomeToken={onClickOutcomeToken}
      onClickMarketTitle={onClickMarketTitle}
      marketId={marketId}
    />
  );
};
