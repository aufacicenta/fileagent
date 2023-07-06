// NEAR keys .near-credentials/testnet/pw-server.pulsemarkets.testnet.json'

// Read the IPFS images uploaded by generate-random-image.ts and create a new Prompt Wars Market contract
// Use the server NEAR wallet credentials to sign the create_market transaction in market-factory

// Start a cronjob to call the reveal method of the market contract when market.ends_at is reached
// Start a cronjob to call the resolve method of the market contract when resolution.reveal_window ends

// Start a websockets server to let clients know the status of the market?

// This server NEAR wallet is the only one that can call "reveal" when ready
// This server NEAR wallet is the only one that can call "resolve" when ready

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

    const { accountId, decimals } = pulse.getConfig().COLLATERAL_TOKENS[0];

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

    ms = resolution.window - marketData.starts_at;
    ms += 10000;
    const createEndpoint = routes.api.promptWars.create();

    logger.info(`setting timeout to call the create API endpoint ${createEndpoint} for market ${marketId} in ${ms} ms`);
    setTimeout(async () => {
      try {
        logger.info(`calling create API endpoint ${createEndpoint} for market ${marketId}`);
        await fetch(createEndpoint);
      } catch (error) {
        logger.error(error);
      }
    }, ms);

    response.status(200).json(promptWarsMarketArgs);
  } catch (error) {
    logger.error(error);
    response.status(500).json({ error: (error as Error).message });
  }
}
