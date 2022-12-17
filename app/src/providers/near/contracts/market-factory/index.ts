import { Contract, WalletConnection } from "near-api-js";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";
import { v4 as uuidv4 } from "uuid";

import near from "providers/near";

import { DeployMarketContractArgs, MarketContractMethods, MarketFactoryContractValues } from "./market-factory.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class MarketFactoryContract {
  values: MarketFactoryContractValues | undefined;

  contract: Contract & MarketContractMethods;

  contractAddress: string;

  constructor(contract: Contract & MarketContractMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
  }

  static getDefaultContractValues = (): MarketFactoryContractValues => ({
    marketsCount: 0,
  });

  static async createMarket(connection: WalletConnection, args: DeployMarketContractArgs) {
    try {
      const contractAddress = near.getConfig().marketFactoryAccountId;
      const contract = await MarketFactoryContract.loadFromWalletConnection(connection, contractAddress);

      const base64args = Buffer.from(JSON.stringify(args)).toString("base64");

      const storageDeposit = new BN(near.parseNearAmount("0.00235")!);
      const attachedDeposit = new BN(near.parseNearAmount(Number(args.market.options.length + 1.9).toString())!);

      const name = uuidv4().slice(0, 13);

      await contract.create_market(
        { name, args: base64args },
        new BN("300000000000000").toNumber(),
        attachedDeposit.add(storageDeposit).toString(),
      );

      return contract;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  static async loadFromGuestConnection() {
    const connection = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      ...near.getConfig(),
    });

    const account = await connection.account(near.getConfig().guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };
    const contractAddress = near.getConfig().marketFactoryAccountId;

    const contract = near.initContract<MarketContractMethods>(account, contractAddress, contractMethods);

    return new MarketFactoryContract(contract);
  }

  static async loadFromWalletConnection(connection: WalletConnection, contractAddress: string) {
    const account = await connection.account();
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    return near.initContract<MarketContractMethods>(account, contractAddress, contractMethods);
  }

  async getMarketsList() {
    try {
      const result = await this.contract.get_markets_list();

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
