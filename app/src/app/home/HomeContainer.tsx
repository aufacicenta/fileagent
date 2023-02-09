import { useEffect, useState } from "react";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";
import { GenericLoader } from "ui/generic-loader/GenericLoader";
import { Typography } from "ui/typography/Typography";
import { NearMarketContractContextController } from "context/near/market-contract/NearMarketContractContextController";

import { Home } from "./Home";

export const HomeContainer = () => {
  const [marketId, setMarketId] = useState("");

  const toast = useToastContext();

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  if (!marketId) {
    return <GenericLoader />;
  }

  return (
    <NearMarketContractContextController marketId={marketId}>
      <Home marketId={marketId} />
    </NearMarketContractContextController>
  );
};
