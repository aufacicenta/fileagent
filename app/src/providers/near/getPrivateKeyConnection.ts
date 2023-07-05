import * as nearAPI from "near-api-js";

import getConfig, { DEFAULT_NETWORK_ENV } from "./getConfig";

const getPrivateKeyConnection = async () => {
  const config = getConfig();

  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  const keypair = nearAPI.KeyPair.fromString(process.env.NEAR_SIGNER_PRIVATE_KEY as string);

  await keyStore.setKey(DEFAULT_NETWORK_ENV, config.serverWalletId, keypair);

  const near = await nearAPI.connect({
    keyStore,
    headers: {},
    ...config,
  });

  return near;
};

export default getPrivateKeyConnection;
