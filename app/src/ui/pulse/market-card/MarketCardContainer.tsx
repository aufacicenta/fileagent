import { useEffect, useState } from "react";

import { Typography } from "ui/typography/Typography";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { MarketContract } from "providers/near/contracts/market";
import { MarketContractValues } from "providers/near/contracts/market/market.types";

import { MarketCardContainerProps } from "./MarketCard.types";
import { MarketCard } from "./MarketCard";
import { MarketCardTemplate } from "./MarketCardTemplate";

export const MarketCardContainer: React.FC<MarketCardContainerProps> = ({ className, expanded, marketId }) => {
  const [marketContractValues, setMarketContractValues] = useState<MarketContractValues>();

  const toast = useToastContext();

  useEffect(() => {
    (async () => {
      try {
        const contract = await MarketContract.loadFromGuestConnection(marketId);
        const market = await contract.getMarketData();
        const resolutionWindow = await contract.getResolutionWindow();

        if (!market || !resolutionWindow) {
          throw new Error("Failed to fetch market data");
        }

        setMarketContractValues({ market, resolutionWindow });
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

  if (!marketContractValues) {
    return <MarketCardTemplate expanded={expanded} />;
  }

  return <MarketCard expanded={expanded} marketContractValues={marketContractValues} className={className} />;
};
