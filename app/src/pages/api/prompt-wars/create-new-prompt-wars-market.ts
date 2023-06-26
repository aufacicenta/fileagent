// NEAR keys .near-credentials/testnet/pw-server.pulsemarkets.testnet.json'

// Read the IPFS images uploaded by generate-random-image.ts and create a new Prompt Wars Market contract
// Use the server NEAR wallet credentials to sign the create_market transaction in market-factory

// Start a cronjob to call the reveal method of the market contract when market.ends_at is reached
// Start a cronjob to call the resolve method of the market contract when resolution.reveal_window ends

// Start a websockets server to let clients know the status of the market?

// This server NEAR wallet is the only one that can call "reveal" when ready
// This server NEAR wallet is the only one that can call "resolve" when ready

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import logger from "providers/logger";
import { PromptWarsMarketFactory } from "providers/near/contracts/prompt-wars-market-factory/contract";
import { DeployPromptWarsMarketContractArgs } from "providers/near/contracts/prompt-wars-market-factory/prompt-wars-market-factory.types";
import pulse from "providers/pulse";
import {
  CollateralTokenMetadata,
  Management,
  MarketData,
} from "providers/near/contracts/prompt-wars/prompt-wars.types";
import near from "providers/near";

export const config = {
  runtime: "edge",
};

export default async function Fn(request: NextRequest) {
  try {
    // @TODO get image_uri from IPFS database, should not repeat.
    // When fetched, make sure to change the is_used flag to true
    // labels: 100 USDT
    const market: MarketData = {
      image_uri: "TODO",
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const collateral_token: CollateralTokenMetadata = {
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

    logger.info({ promptWarsMarketArgs });

    const id = `pw-${uuidv4().slice(0, 4)}`;

    // @TODO deploy and init prompt wars contract
    // labels: 250 USDT
    await PromptWarsMarketFactory.createMarket(id, promptWarsMarketArgs);

    return NextResponse.json({
      name: `Hello, from ${request.url} I'm an Edge Function!`,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Error from ${request.url}: ${(error as Error).message}`,
    });
  }
}
