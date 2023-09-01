import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";

import logger from "providers/logger";
import { DeployPromptWarsMarketContractArgs } from "providers/near/contracts/prompt-wars-market-factory/prompt-wars-market-factory.types";
import pulse from "providers/pulse";
import { CollateralToken, Management, MarketData } from "providers/near/contracts/prompt-wars/prompt-wars.types";
import near from "providers/near";
import { PromptWarsMarketFactory } from "providers/near/contracts/prompt-wars-market-factory/contract";
import { PromptWarsMarketContract } from "providers/near/contracts/prompt-wars/contract";
import ipfs from "providers/ipfs";
import { routes } from "hooks/useRoutes/useRoutes";

export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    const latestMarketId = await pulse.promptWars.getLatestMarketId();

    if (await pulse.promptWars.isMarketActive(latestMarketId!)) {
      throw new Error("ERR_LATEST_MARKET_IS_STILL_ACTIVE");
    }

    const image_uri = await ipfs.getFileAsIPFSUrl("https://source.unsplash.com/random/512x512");

    const market: MarketData = {
      image_uri,
      //   Set to 0, it will be set in the contract initialization
      starts_at: 0,
      //   Set to 0, it will be set in the contract initialization
      ends_at: 0,
    };

    const management: Management = {
      dao_account_id: near.getConfig().marketDaoAccountId,
      market_creator_account_id: near.getConfig().serverWalletId,
      //   Set to 0, it will be set in the contract initialization
      self_destruct_window: 0,
      //   Set to 0, it will be set in the contract initialization
      buy_sell_threshold: 0,
    };

    const { accountId, decimals } = pulse.getDefaultCollateralToken();

    const collateral_token: CollateralToken = {
      id: accountId,
      decimals,
      balance: 0,
      fee_balance: 0,
    };

    const promptWarsMarketArgs: DeployPromptWarsMarketContractArgs = {
      market,
      management,
      collateral_token,
    };

    const id = `pw-${uuidv4().slice(0, 4)}`;

    await PromptWarsMarketFactory.createMarket(id, promptWarsMarketArgs);

    logger.info({ promptWarsMarketArgs, id });

    const marketId = `${id}.${near.getConfig().factoryWalletId}`;

    const marketContract = await PromptWarsMarketContract.loadFromGuestConnection(marketId);
    const marketData = await marketContract.get_market_data();
    const resolution = await marketContract.get_resolution_data();

    let ms = marketData.ends_at - marketData.starts_at;
    const revealEndpoint = routes.api.promptWars.reveal();

    logger.info(`setting timeout to call the reveal API endpoint ${revealEndpoint} for market ${marketId} in ${ms} ms`);
    setTimeout(async () => {
      try {
        logger.info(`calling the reveal API endpoint ${revealEndpoint} for market ${marketId}`);
        await fetch(revealEndpoint);
      } catch (error) {
        logger.error(error);
      }
    }, ms);

    ms = resolution.reveal_window - marketData.starts_at;
    const resolveEndpoint = routes.api.promptWars.resolve();

    logger.info(
      `setting timeout to call the resolution API endpoint ${resolveEndpoint} for market ${marketId} in ${ms} ms`,
    );
    setTimeout(async () => {
      try {
        logger.info(`calling resolution API endpoint ${resolveEndpoint} for market ${marketId}`);
        await fetch(resolveEndpoint);
      } catch (error) {
        logger.error(error);
      }
    }, ms);

    response.status(200).json({ promptWarsMarketArgs, id });
  } catch (error) {
    logger.error(error);

    response.status(500).json({ error: (error as Error).message });
  }
}
