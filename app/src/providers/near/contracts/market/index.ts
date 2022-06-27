import { Contract } from "near-api-js";
import * as nearAPI from "near-api-js";

import nearUtils from "providers/near";
import date from "providers/date";
import { DEFAULT_NETWORK_ENV } from "../../getConfig";

import { DeployMarketContractArgs, MarketContractMethods, MarketContractValues } from "./market.types";
import { VIEW_METHODS } from "./constants";

export class MarketContract {
  values: MarketContractValues | undefined;

  contract: Contract & MarketContractMethods;

  contractAddress: string;

  constructor(contract: Contract & MarketContractMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
  }

  static getDefaultContractValues = (): MarketContractValues => ({
    totalFunds: "0",
    fundingAmountLimit: nearUtils.formatAccountBalance("0"),
    unpaidFundingAmount: nearUtils.formatAccountBalance("0"),
    depositsOf: "0",
    depositsOfPercentage: 0,
    currentCoinPrice: 0,
    priceEquivalence: 0,
    totalFundedPercentage: 0,
    expirationDate: date.toNanoseconds(date.now().toDate().getTime()),
    daoFactoryAccountId: "",
    ftFactoryAccountId: "",
    daoName: "",
    metadataURL: "",
    isDepositAllowed: false,
    isWithdrawalAllowed: false,
    deposits: [],
  });

  static async deploy(args: DeployMarketContractArgs) {
    // @TODO impl
    return args;
  }

  static async getFromConnection(contractAddress: string) {
    const near = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      ...nearUtils.getConfig(DEFAULT_NETWORK_ENV),
    });

    const account = await near.account(nearUtils.getConfig(DEFAULT_NETWORK_ENV).guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: [] };

    return nearUtils.initContract<MarketContractMethods>(account, contractAddress, contractMethods);
  }
}
