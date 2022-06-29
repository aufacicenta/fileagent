import { Contract } from "near-api-js";
import * as nearAPI from "near-api-js";

import near from "providers/near";
import { DEFAULT_NETWORK_ENV } from "../../getConfig";

import { MarketContractMethods, MarketContractValues } from "./market.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class MarketContract {
  values: MarketContractValues | undefined;

  contract: Contract & MarketContractMethods;

  contractAddress: string;

  constructor(contract: Contract & MarketContractMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
  }

  static getDefaultContractValues = (): MarketContractValues => ({});

  static async loadFromGuestConnection(contractAddress: string) {
    const connection = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      ...near.getConfig(DEFAULT_NETWORK_ENV),
    });

    const account = await connection.account(near.getConfig(DEFAULT_NETWORK_ENV).guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    const contract = near.initContract<MarketContractMethods>(account, contractAddress, contractMethods);

    return new MarketContract(contract);
  }

  async getMarketData() {
    try {
      const result = await this.contract.get_market_data();

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
