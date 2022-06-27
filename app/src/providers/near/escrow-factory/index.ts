import * as nearAPI from "near-api-js";
import { Contract } from "near-api-js";

import { EscrowFactoryMethods, EscrowFactoryValues } from "../contract/escrow-factory.types";
import nearUtils from "providers/near";
import { DEFAULT_NETWORK_ENV } from "../getConfig";
import { VIEW_METHODS } from "../contract/escrow-factory";

export class EscrowFactory {
  values: EscrowFactoryValues | undefined;

  contract: Contract & EscrowFactoryMethods;

  contractAddress: string;

  constructor(contract: Contract & EscrowFactoryMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
  }

  static async getFromConnection() {
    const near = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      // @TODO DEFAULT_NETWORK_ENV should be dynamic from client headers: testnet or mainnet
      ...nearUtils.getConfig(DEFAULT_NETWORK_ENV),
    });

    const account = await near.account(nearUtils.getConfig(DEFAULT_NETWORK_ENV).guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: [] };
    const contractAddress = nearUtils.getConfig(DEFAULT_NETWORK_ENV).escrowFactoryContractName;

    return nearUtils.initContract<EscrowFactoryMethods>(account, contractAddress, contractMethods);
  }

  async getConditionalEscrowContractsList(): Promise<EscrowFactoryValues["conditionalEscrowContractsList"]> {
    const conditionalEscrowContractsList = await this.contract.get_conditional_escrow_contracts_list();

    return conditionalEscrowContractsList;
  }
}
