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
import { MarketFactoryContract } from "providers/near/contracts/market-factory";

const latestMarketIsActive = async () => {
  const marketFactory = await MarketFactoryContract.loadFromGuestConnection();
  const marketsList = await marketFactory.get_markets_list();

  if (!marketsList) {
    logger.error("ERR_FAILED_TO_FETCH_MARKETS");

    return false;
  }

  const latestMarketId = marketsList.pop();
  const latestMarketContract = await PromptWarsMarketContract.loadFromGuestConnection(latestMarketId!);
  const [is_over, is_reveal_window_expired, is_resolution_window_expired] = await Promise.all([
    latestMarketContract.is_over(),
    latestMarketContract.is_reveal_window_expired(),
    latestMarketContract.is_resolution_window_expired(),
  ]);

  return !is_over || !is_reveal_window_expired || !is_resolution_window_expired;
};

// @TODO authenticate the request, only this server should be able to execute this endpoint
// labels: 100 USDT
export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    if (await latestMarketIsActive()) {
      throw new Error("ERR_LATEST_MARKET_IS_STILL_ACTIVE");
    }

    // @TODO get image_uri from IPFS database, should not repeat.
    // When fetched, make sure to change the is_used flag to true
    // labels: 100 USDT
    const market: MarketData = {
      image_uri: "bafybeigb5am5yjzxep7hk55vcduatk5z5mceig5vrwqzzjmhxg65vigwbm/toast.jpg",
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

    let ms = marketData.ends_at - marketData.starts_at + 1000;

    logger.info(`setting timeout to call the reveal API endpoint for market ${marketId} in ${ms} ms`);
    setTimeout(async () => {
      try {
        logger.info(`calling the reveal API endpoint for market ${marketId}`);
        await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/compare-image-with-source`);
      } catch (error) {
        logger.error(error);
      }
    }, ms);

    ms = resolution.window - marketData.ends_at + 1000;

    logger.info(`setting timeout to call the resolution API endpoint for market ${marketId} in ${ms} ms`);
    setTimeout(async () => {
      try {
        logger.info(`calling resolution API endpoint for market ${marketId}`);
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
