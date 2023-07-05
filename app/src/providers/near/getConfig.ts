import { NetworkId } from "@near-wallet-selector/core";

export const DEFAULT_NETWORK_ENV = process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV as NetworkId;
// 2% of 6 precision decimals
export const DEFAULT_FEE_RATIO = 20000;
export const DEFAULT_RESOLUTION_WINDOW_DAY_SPAN = 3; // days
export const DEFAULT_CLAIMING_WINDOW_DAY_SPAN = 30; // days

const TESTNET_GUEST_WALLET_ID = "pulsemarkets.testnet";
const MAINNET_GUEST_WALLET_ID = "pulsemarkets.near";

const TESTNET_DAO_ACCOUNT_ID = "pulse-dao.sputnikv2.testnet";
const MAINNET_DAO_ACCOUNT_ID = "pulse-dao.sputnik-dao.near";

const TESTNET_DAO_URL = `https://testnet.app.astrodao.com/dao/${TESTNET_DAO_ACCOUNT_ID}/proposals?status=&category=FunctionCalls`;
const MAINNET_DAO_URL = `https://app.astrodao.com/dao/${MAINNET_DAO_ACCOUNT_ID}/proposals?status=&category=FunctionCalls`;

const TESTNET_AMM_FACTORY_ACCOUNT_ID = "market-factory-2.pulsemarkets.testnet";
const MAINNET_AMM_FACTORY_ACCOUNT_ID = "factory.pulsemarkets.near";

const TESTNET_SIGNER_WALLET_ID = "pw-server.pulsemarkets.testnet";
const MAINNET_SIGNER_WALLET_ID = "pw-server.pulsemarkets.near";

const TESTNET_FACTORY_WALLET_ID = "pw-factory.pulsemarkets.testnet";
const MAINNET_FACTORY_WALLET_ID = "pw-factory.pulsemarkets.near";

const TESTNET_CONFIG = {
  marketFactoryAccountId: TESTNET_AMM_FACTORY_ACCOUNT_ID,
  marketDaoAccountId: TESTNET_DAO_ACCOUNT_ID,
  marketDaoUrl: TESTNET_DAO_URL,
  guestWalletId: TESTNET_GUEST_WALLET_ID,
  serverWalletId: TESTNET_SIGNER_WALLET_ID,
  factoryWalletId: TESTNET_FACTORY_WALLET_ID,
};

export default (network: NetworkId | undefined = DEFAULT_NETWORK_ENV) => {
  switch (network) {
    case "mainnet":
      return {
        networkId: "mainnet" as NetworkId,
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.near.org",
        marketFactoryAccountId: MAINNET_AMM_FACTORY_ACCOUNT_ID,
        marketDaoAccountId: MAINNET_DAO_ACCOUNT_ID,
        marketDaoUrl: MAINNET_DAO_URL,
        guestWalletId: MAINNET_GUEST_WALLET_ID,
        serverWalletId: MAINNET_SIGNER_WALLET_ID,
        factoryWalletId: MAINNET_FACTORY_WALLET_ID,
      };
    case "testnet":
      return {
        ...TESTNET_CONFIG,
        networkId: "testnet" as NetworkId,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    default:
      return {
        ...TESTNET_CONFIG,
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
  }
};
