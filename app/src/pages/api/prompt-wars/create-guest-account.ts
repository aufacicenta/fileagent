import { v4 as uuidv4 } from "uuid";
import { KeyPair } from "near-api-js/lib/utils/key_pair";
import { NextApiRequest, NextApiResponse } from "next";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";

import logger from "providers/logger";
import near from "providers/near";

export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`creating Prompt Wars guest account for: GENERATE FROM npm biri ID`);

    const accountId = near.getConfig().guestWalletId;

    const connection = await near.getPrivateKeyConnection(process.env.NEAR_OWNER_PRIVATE_KEY, accountId);

    const account = await connection.account(accountId);

    const id = `guest-${uuidv4().slice(0, 5)}.${accountId}`;

    const pk = KeyPair.fromRandom("ed25519");

    const publicKey = pk.getPublicKey();

    logger.info(publicKey.toString(), id, accountId);

    const newAccount = await account.createAccount(
      id,
      publicKey,
      new BN(nearAPI.utils.format.parseNearAmount("0.3") as string),
    );

    // @TODO transfer 0.1 USDT collateral to register the new account
    // labels: 100 USDT

    logger.info(newAccount);

    response.status(200).json({
      promptwars_wallet_auth_key: { accountId: id, allKeys: [publicKey.toString()] },
      [`near-api-js:keystore:${id}:${near.getConfig().networkId}`]: pk.toString(),
      "near-wallet-selector:contract": { contractId: near.getConfig().factoryWalletId },
    });
  } catch (error) {
    logger.error(error);

    response.status(500).json({ error: (error as Error).message });
  }
}
