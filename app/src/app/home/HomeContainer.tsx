import { useEffect } from "react";

import { GenericLoader } from "ui/generic-loader/GenericLoader";
import { useNearMarketFactoryContractContext } from "context/near/market-factory-contract/useNearMarketFactoryContractContext";
import { PromptWars } from "app/prompt-wars/PromptWars";
import { NearPromptWarsMarketContractContextController } from "context/near/prompt-wars-market-contract/NearPromptWarsMarketContractContextController";

export const HomeContainer = () => {
  const { fetchLatestPriceMarket, marketId } = useNearMarketFactoryContractContext();

  useEffect(() => {
    fetchLatestPriceMarket();
  }, [marketId]);

  if (!marketId) {
    return <GenericLoader />;
  }

  return (
    <NearPromptWarsMarketContractContextController marketId={marketId}>
      <PromptWars marketId={marketId} />
    </NearPromptWarsMarketContractContextController>
  );
};
