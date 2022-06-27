import * as nearAPI from "near-api-js";

import getConfig from "./getConfig";

export default async (network: string | undefined) => {
  const nearConfig = getConfig(network);
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const near = await nearAPI.connect({
    keyStore,
    headers: {},
    ...nearConfig,
  });

  const wallet = new nearAPI.WalletConnection(near, null);

  return { near, wallet };
};
