export const DEFAULT_NETWORK_ENV = "testnet";
export const DEFAULT_FEE_RATIO = 0.02;
export const DEFAULT_RESOLUTION_WINDOW_DAY_SPAN = 3; // days

const CONTRACT_NAME = process.env.CONTRACT_NAME || "testnet";

const TESTNET_GUEST_WALLET_ID = "nearholdings.testnet";
const MAINNET_GUEST_WALLET_ID = "communitycapital.near";

const TESTNET_DAO_ACCOUNT_ID = "pulse-dao.sputnikv2.testnet";
const MAINNET_DAO_ACCOUNT_ID = "pulse-dao.sputnikv2.near";

const TESTNET_AMM_FACTORY_ACCOUNT_ID = "amm-factory-2.aufacicenta.testnet";
const MAINNET_AMM_FACTORY_ACCOUNT_ID = "amm-factory-2.aufacicenta.near";

const TESTNET_CONFIG = {
  marketFactoryAccountId: TESTNET_AMM_FACTORY_ACCOUNT_ID,
  marketDaoAccountId: TESTNET_DAO_ACCOUNT_ID,
  guestWalletId: TESTNET_GUEST_WALLET_ID,
};

export default (network: string | undefined) => {
  switch (network) {
    case "mainnet":
      return {
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.near.org",
        marketFactoryAccountId: MAINNET_AMM_FACTORY_ACCOUNT_ID,
        marketDaoAccountId: MAINNET_DAO_ACCOUNT_ID,
        guestWalletId: MAINNET_GUEST_WALLET_ID,
        contractName: CONTRACT_NAME,
      };
    case "test":
    case "testnet":
      return {
        ...TESTNET_CONFIG,
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    case "betanet":
      return {
        ...TESTNET_CONFIG,
        networkId: "betanet",
        nodeUrl: "https://rpc.betanet.near.org",
        walletUrl: "https://wallet.betanet.near.org",
        helperUrl: "https://helper.betanet.near.org",
      };
    case "local":
      return {
        ...TESTNET_CONFIG,
        networkId: "local",
        nodeUrl: "http://localhost:3030",
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: "http://localhost:4000/wallet",
      };
    case "ci":
      return {
        ...TESTNET_CONFIG,
        networkId: "shared-test",
        nodeUrl: "https://rpc.ci-testnet.near.org",
        masterAccount: "test.near",
      };
    case "ci-betanet":
      return {
        ...TESTNET_CONFIG,
        networkId: "shared-test-staging",
        nodeUrl: "https://rpc.ci-betanet.near.org",
        masterAccount: "test.near",
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
