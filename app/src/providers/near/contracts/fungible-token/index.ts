import { Contract, WalletConnection } from "near-api-js";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";

import near from "providers/near";
import { DEFAULT_NETWORK_ENV } from "../../getConfig";
import { AccountId } from "../market/market.types";

import {
  FungibleTokenContractMethods,
  FungibleTokenContractValues,
  FtTransferCallArgs,
  FtBalanceOfArgs,
} from "./fungible-token.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class FungibleTokenContract {
  values: FungibleTokenContractValues | undefined;

  contract: Contract & FungibleTokenContractMethods;

  contractAddress: AccountId;

  constructor(contract: Contract & FungibleTokenContractMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
  }

  static async loadFromGuestConnection(contractAddress: string) {
    const connection = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      ...near.getConfig(DEFAULT_NETWORK_ENV),
    });

    const account = await connection.account(near.getConfig(DEFAULT_NETWORK_ENV).guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    const contract = near.initContract<FungibleTokenContractMethods>(account, contractAddress, contractMethods);

    return new FungibleTokenContract(contract);
  }

  static async loadFromWalletConnection(connection: WalletConnection, contractAddress: string) {
    const account = await connection.account();
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    const contract = near.initContract<FungibleTokenContractMethods>(account, contractAddress, contractMethods);

    return new FungibleTokenContract(contract);
  }

  async ftTransferCall(args: FtTransferCallArgs) {
    try {
      const result = await this.contract.ft_transfer_call(args, new BN("33000000000000").toNumber(), 1);

      return result;
    } catch (error) {
      console.log(error);
    }

    return "0.00";
  }

  async ftBalanceOf(args: FtBalanceOfArgs) {
    try {
      const result = await this.contract.ft_balance_of(args);

      return result;
    } catch (error) {
      console.log(error);
    }

    return "0.00";
  }
}
