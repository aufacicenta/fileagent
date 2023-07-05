import { NextApiRequest, NextApiResponse } from "next";

import logger from "providers/logger";
import pulse from "providers/pulse";
import { PromptWarsMarketContract } from "providers/near/contracts/prompt-wars/contract";

export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    const marketId = await pulse.promptWars.getLatestMarketId();

    await PromptWarsMarketContract.resolve(marketId!);

    await PromptWarsMarketContract.sellResolved(marketId!);

    await PromptWarsMarketContract.claimFees(marketId!);

    await PromptWarsMarketContract.selfDestruct(marketId!);

    response.status(200).json({ marketId });
  } catch (error) {
    logger.error(error);
    response.status(500).json({ error: (error as Error).message });
  }
}
