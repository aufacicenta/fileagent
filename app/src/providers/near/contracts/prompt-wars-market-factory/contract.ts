import { Contract } from "near-api-js";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";

import logger from "providers/logger";
import near from "providers/near";
import { AccountId } from "../prompt-wars/prompt-wars.types";

import {
  DeployPromptWarsMarketContractArgs,
  PromptWarsMarketFactoryContractMethods,
  PromptWarsMarketFactoryContractValues,
} from "./prompt-wars-market-factory.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class PromptWarsMarketFactory {
  values: PromptWarsMarketFactoryContractValues | undefined;

  contract: Contract & PromptWarsMarketFactoryContractMethods;

  contractAddress: string;

  constructor(contract: Contract & PromptWarsMarketFactoryContractMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
  }

  static async loadFromGuestConnection(contractAddress: AccountId) {
    try {
      const connection = await nearAPI.connect({
        keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
        headers: {},
        ...near.getConfig(),
      });

      const account = await connection.account(near.getConfig().guestWalletId);
      const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

      const contract = near.initContract<PromptWarsMarketFactoryContractMethods>(
        account,
        contractAddress,
        contractMethods,
      );

      return contract;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async createMarket(name: string, props: DeployPromptWarsMarketContractArgs) {
    logger.info(`creating Prompt Wars contract from ${near.getConfig().serverWalletId}`);

    const connection = await near.getPrivateKeyConnection();
    const account = await connection.account(near.getConfig().serverWalletId);

    const base64args = Buffer.from(JSON.stringify(props)).toString("base64");
    const contractId = near.getConfig().factoryWalletId;
    const methodName = "create_market";

    const gas = new BN("300000000000000");
    const attachedDeposit = new BN("4000000000000000000000000");

    const args = {
      name,
      args: base64args,
    };

    await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    });
  }

  static async get_markets_list() {
    try {
      const contract = await PromptWarsMarketFactory.loadFromGuestConnection(near.getConfig().factoryWalletId);

      const result = await contract.get_markets_list();

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
