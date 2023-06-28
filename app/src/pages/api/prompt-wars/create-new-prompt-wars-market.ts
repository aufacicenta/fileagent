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

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    // @TODO get image_uri from IPFS database, should not repeat.
    // When fetched, make sure to change the is_used flag to true
    // labels: 100 USDT
    const market: MarketData = {
      image_uri: "bafybeifdh3nf5duckpcpq5hgspg5g6fhnrx4vpabciqs6zcvfx43dpqd24/toast.jpg",
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

    // @TODO deploy and init prompt wars contract
    // labels: 250 USDT
    await PromptWarsMarketFactory.createMarket(id, promptWarsMarketArgs);

    logger.info({ promptWarsMarketArgs, id });

    response.status(200).json(promptWarsMarketArgs);

    // return NextResponse.json({
    //   name: `Hello, from ${request.url} I'm an Edge Function!`,
    // });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: (error as Error).message });
    // return NextResponse.json({
    //   error: `Error from ${request.url}: ${(error as Error).message}`,
    // });
  }
}
