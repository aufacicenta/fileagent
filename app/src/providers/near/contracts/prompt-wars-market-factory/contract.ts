import { Contract } from "near-api-js";
import { BN } from "bn.js";

import logger from "providers/logger";
import near from "providers/near";

import {
  DeployPromptWarsMarketContractArgs,
  PromptWarsMarketFactoryContractMethods,
  PromptWarsMarketFactoryContractValues,
} from "./prompt-wars-market-factory.types";

export class PromptWarsMarketFactory {
  values: PromptWarsMarketFactoryContractValues | undefined;

  contract: Contract & PromptWarsMarketFactoryContractMethods;

  contractAddress: string;

  constructor(contract: Contract & PromptWarsMarketFactoryContractMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
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

    const response = await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    });

    logger.info(response);
  }
}
