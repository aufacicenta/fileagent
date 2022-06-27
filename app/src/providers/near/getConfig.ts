export const DEFAULT_NETWORK_ENV = "testnet";

const CONTRACT_NAME = process.env.CONTRACT_NAME || "testnet";

const TESTNET_GUEST_WALLET_ID = "nearholdings.testnet";
const MAINNET_GUEST_WALLET_ID = "communitycapital.near";

const TESTNET_DAO_CONTRACT_NAME = "sputnikv2.testnet";
const MAINNET_DAO_CONTRACT_NAME = "sputnik-dao.near";

const TESTNET_ESCROWFACTORY_CONTRACT_NAME = "escrowfactory.nearholdings.testnet";
const MAINNET_ESCROWFACTORY_CONTRACT_NAME = "escrowfactory.communitycapital.near";

const TESTNET_DAOFACTORY_CONTRACT_NAME = "daofactory2.nearholdings.testnet";
const MAINNET_DAOFACTORY_CONTRACT_NAME = "daofactory.communitycapital.near";

const TESTNET_FTFACTORY_CONTRACT_NAME = "ftfactory2.nearholdings.testnet";
const MAINNET_FTFACTORY_CONTRACT_NAME = "ftfactory.communitycapital.near";

const TESTNET_SKFACTORY_CONTRACT_NAME = "stakingfactory.nearholdings.testnet";
const MAINNET_SKFACTORY_CONTRACT_NAME = "stakingfactory.communitycapital.near";

const TESTNET_ASTRODAO_URL_ORIGIN = "https://dev.app.astrodao.com";
const MAINNET_ASTRODAO_URL_ORIGIN = "https://app.astrodao.com";

const TESTNET_FEATURED_ACTIVE_HOLDINGS = [
  "ce_eay7eydcxk8nwp8rvo6zpo.escrowfactory.nearholdings.testnet",
  "ce_1t0tchrruu9l8zmkknpi1t.escrowfactory.nearholdings.testnet",
  "ce_fjfpt2dryzyfyfjsf597lq.escrowfactory.nearholdings.testnet",
];
const MAINNET_FEATURED_ACTIVE_HOLDINGS = ["ce_k95zme9rxsppqvjfw2gyvj.escrowfactory12.nearholdings.testnet"];

const TESTNET_CONFIG = {
  guestWalletId: TESTNET_GUEST_WALLET_ID,
  contractName: CONTRACT_NAME,
  daoContractName: TESTNET_DAO_CONTRACT_NAME,
  escrowFactoryContractName: TESTNET_ESCROWFACTORY_CONTRACT_NAME,
  daoFactoryContractName: TESTNET_DAOFACTORY_CONTRACT_NAME,
  ftFactoryContractName: TESTNET_FTFACTORY_CONTRACT_NAME,
  skFactoryContractName: TESTNET_SKFACTORY_CONTRACT_NAME,
  featuredActiveHoldings: TESTNET_FEATURED_ACTIVE_HOLDINGS,
  astroDaoURLOrigin: TESTNET_ASTRODAO_URL_ORIGIN,
};

export default (network: string | undefined) => {
  switch (network) {
    case "mainnet":
      return {
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        guestWalletId: MAINNET_GUEST_WALLET_ID,
        contractName: CONTRACT_NAME,
        daoContractName: MAINNET_DAO_CONTRACT_NAME,
        escrowFactoryContractName: MAINNET_ESCROWFACTORY_CONTRACT_NAME,
        daoFactoryContractName: MAINNET_DAOFACTORY_CONTRACT_NAME,
        ftFactoryContractName: MAINNET_FTFACTORY_CONTRACT_NAME,
        skFactoryContractName: MAINNET_SKFACTORY_CONTRACT_NAME,
        featuredActiveHoldings: MAINNET_FEATURED_ACTIVE_HOLDINGS,
        astroDaoURLOrigin: MAINNET_ASTRODAO_URL_ORIGIN,
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.near.org",
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
