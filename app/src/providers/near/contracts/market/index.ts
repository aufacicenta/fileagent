import { Contract, WalletConnection } from "near-api-js";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";

import near from "providers/near";
import { DEFAULT_NETWORK_ENV } from "../../getConfig";

import { AccountId, GetOutcomeTokenArgs, MarketContractMethods, MarketContractValues } from "./market.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class MarketContract {
  values: MarketContractValues | undefined;

  contract: Contract & MarketContractMethods;

  contractAddress: AccountId;

  constructor(contract: Contract & MarketContractMethods) {
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

    const contract = near.initContract<MarketContractMethods>(account, contractAddress, contractMethods);

    return new MarketContract(contract);
  }

  static async loadFromWalletConnection(connection: WalletConnection, contractAddress: string) {
    const account = await connection.account();
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    return near.initContract<MarketContractMethods>(account, contractAddress, contractMethods);
  }

  static async publish(connection: WalletConnection, contractAddress: string) {
    try {
      const contract = await MarketContract.loadFromWalletConnection(connection, contractAddress);

      await contract.publish({}, new BN("60000000000000").toNumber());

      return true;
    } catch (error) {
      console.log(error);
    }

    return false;
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

  async getResolutionWindow() {
    try {
      const result = await this.contract.resolution_window();

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async getOutcomeToken(args: GetOutcomeTokenArgs) {
    try {
      const result = await this.contract.get_outcome_token(args);

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async isPublished() {
    try {
      const result = await this.contract.is_published();

      return result;
    } catch (error) {
      console.log(error);
    }

    return false;
  }

  async getCollateralTokenMetadata() {
    try {
      const result = await this.contract.get_collateral_token_metadata();

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async getFeeRatio() {
    try {
      const result = await this.contract.get_fee_ratio();

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
