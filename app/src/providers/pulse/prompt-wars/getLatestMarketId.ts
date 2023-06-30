import { MarketFactoryContract } from "providers/near/contracts/market-factory";

export default async () => {
  const marketFactory = await MarketFactoryContract.loadFromGuestConnection();
  const marketsList = await marketFactory.get_markets_list();

  if (!marketsList) {
    throw new Error("ERR_FAILED_TO_FETCH_MARKETS");
  }

  const latestMarketId = marketsList.pop();

  return latestMarketId;
};
