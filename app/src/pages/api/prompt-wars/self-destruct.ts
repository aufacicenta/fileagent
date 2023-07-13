import { NextApiRequest, NextApiResponse } from "next";

import logger from "providers/logger";
import { PromptWarsMarketContract } from "providers/near/contracts/prompt-wars/contract";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";

export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    const marketFactory = await MarketFactoryContract.loadFromGuestConnection();
    const marketsList = await marketFactory.get_markets_list();

    await Promise.all(
      marketsList!.map(async (marketId) => {
        try {
          const contract = await PromptWarsMarketContract.loadFromGuestConnection(marketId!);
          const is_self_destruct_window_expired = await contract.is_self_destruct_window_expired();

          if (!is_self_destruct_window_expired) {
            throw new Error("ERR_LATEST_MARKET_IS_STILL_ACTIVE");
          }

          await PromptWarsMarketContract.selfDestruct(marketId);

          logger.info(`self_destruct method called for market ${marketId}`);
        } catch (error) {
          logger.error(error);
        }
      }),
    );

    response.status(200).json({});
  } catch (error) {
    logger.error(error);
    response.status(500).json({ error: (error as Error).message });
  }
}
