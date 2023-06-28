import { Contract } from "near-api-js";
import * as nearAPI from "near-api-js";

import near from "providers/near";
import date from "providers/date";

import { AccountId, PromptWarsMarketContractMethods, PromptWarsMarketContractValues } from "./prompt-wars.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class PromptWarsMarketContract {
  values: PromptWarsMarketContractValues | undefined;

  contract: Contract & PromptWarsMarketContractMethods;

  contractAddress: AccountId;

  constructor(contract: Contract & PromptWarsMarketContractMethods) {
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

      const contract = near.initContract<PromptWarsMarketContractMethods>(account, contractAddress, contractMethods);

      return new PromptWarsMarketContract(contract);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async loadFromWalletConnection(
    connection: nearAPI.WalletConnection,
    contractAddress: string,
  ): Promise<[PromptWarsMarketContract, Contract & PromptWarsMarketContractMethods]> {
    const account = await connection.account();
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    const contract = near.initContract<PromptWarsMarketContractMethods>(account, contractAddress, contractMethods);

    return [new PromptWarsMarketContract(contract), contract];
  }

  async get_market_data() {
    try {
      const result = await this.contract.get_market_data();

      return {
        ...result,
        starts_at: date.extractNanoseconds(result.starts_at),
        ends_at: date.extractNanoseconds(result.ends_at),
      };
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_MARKET_DATA");
    }
  }

  async get_resolution_data() {
    try {
      const result = await this.contract.get_resolution_data();

      return {
        ...result,
        window: date.extractNanoseconds(result.window),
        resolved_at: result.resolved_at ? date.extractNanoseconds(result.resolved_at) : undefined,
        reveal_window: date.extractNanoseconds(result.reveal_window),
      };
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_RESOLUTION_DATA");
    }
  }

  async get_fee_data() {
    try {
      const result = await this.contract.get_fee_data();

      return {
        ...result,
        claiming_window: result.claiming_window ? date.extractNanoseconds(result.claiming_window) : undefined,
      };
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_FEE_DATA");
    }
  }

  async get_management_data() {
    try {
      const result = await this.contract.get_management_data();

      return {
        ...result,
        self_destruct_window: date.extractNanoseconds(result.self_destruct_window),
      };
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_MANAGEMENT_DATA");
    }
  }

  async get_collateral_token_metadata() {
    try {
      const result = await this.contract.get_collateral_token_metadata();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_COLLATERAL_TOKEN_METADATA");
    }
  }

  async get_buy_sell_timestamp() {
    try {
      const result = await this.contract.get_buy_sell_timestamp();

      return date.extractNanoseconds(result);
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_BUY_SELL_TIMESTAMP");
    }
  }

  async get_outcome_ids() {
    try {
      const result = await this.contract.get_outcome_ids();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_OUTCOME_IDS");
    }
  }

  async is_resolved() {
    try {
      const result = await this.contract.is_resolved();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_IS_RESOLVED");
    }
  }

  async is_open() {
    try {
      const result = await this.contract.is_open();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_IS_OPEN");
    }
  }

  async is_over() {
    try {
      const result = await this.contract.is_over();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_IS_OVER");
    }
  }

  async is_reveal_window_expired() {
    try {
      const result = await this.contract.is_reveal_window_expired();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_IS_REVEAL_WINDOW_EXPIRED");
    }
  }

  async is_resolution_window_expired() {
    try {
      const result = await this.contract.is_resolution_window_expired();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_IS_RESOLUTION_WINDOW_EXPIRED");
    }
  }

  async is_expired_unresolved() {
    try {
      const result = await this.contract.is_expired_unresolved();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_IS_EXPIRED_UNRESOLVED");
    }
  }

  async is_claiming_window_expired() {
    try {
      const result = await this.contract.is_claiming_window_expired();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_IS_CLAIMING_WINDOW_EXPIRED");
    }
  }
}
