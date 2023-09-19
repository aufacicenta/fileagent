import { NetworkId } from "@near-wallet-selector/core";
import * as nearAPI from "near-api-js";

import getConfig from "./getConfig";

export default async (network?: NetworkId) => {
  const nearConfig = getConfig(network);
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const near = await nearAPI.connect({
    keyStore,
    ...nearConfig,
  });

  const wallet = new nearAPI.WalletConnection(near, "promptwars");

  return { near, wallet };
};
