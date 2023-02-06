import { Contract, WalletConnection } from "near-api-js";
import * as nearAPI from "near-api-js";

import near from "providers/near";

import {
  AccountId,
  BalanceOfArgs,
  GetAmountMintableArgs,
  GetAmountPayableArgs,
  GetOutcomeTokenArgs,
  MarketContractMethods,
  MarketContractValues,
  SellArgs,
} from "./market.types";
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
    try {
      const connection = await nearAPI.connect({
        keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
        headers: {},
        ...near.getConfig(),
      });

      const account = await connection.account(near.getConfig().guestWalletId);
      const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

      const contract = near.initContract<MarketContractMethods>(account, contractAddress, contractMethods);

      return new MarketContract(contract);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async loadFromWalletConnection(
    connection: WalletConnection,
    contractAddress: string,
  ): Promise<[MarketContract, Contract & MarketContractMethods]> {
    const account = await connection.account();
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    const contract = near.initContract<MarketContractMethods>(account, contractAddress, contractMethods);

    return [new MarketContract(contract), contract];
  }

  async sell(args: SellArgs) {
    try {
      const result = await this.contract.sell(args);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_SELL");
    }
  }

  async aggregator_read() {
    try {
      const result = await this.contract.aggregator_read();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_AGGREGATOR_READ");
    }
  }

  async getMarketData() {
    try {
      const result = await this.contract.get_market_data();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_MARKET_DATA");
    }
  }

  async getResolutionWindow() {
    try {
      const result = await this.contract.resolution_window();

      return result;
    } catch {
      return undefined;
    }
  }

  async getBuySellTimestamp() {
    try {
      const result = await this.contract.get_buy_sell_timestamp();

      return result;
    } catch {
      return undefined;
    }
  }

  async getOutcomeToken(args: GetOutcomeTokenArgs) {
    try {
      const result = await this.contract.get_outcome_token(args);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_OUTCOME_TOKEN");
    }
  }

  async isOver() {
    try {
      const result = await this.contract.is_over();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_IS_OVER");
    }
  }

  async isOpen() {
    try {
      const result = await this.contract.is_open();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_IS_OPEN");
    }
  }

  async isResolutionWindowExpired() {
    try {
      const result = await this.contract.is_resolution_window_expired();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_IS_RESOLUTION_WINDOW_EXPIRED");
    }
  }

  async isResolved() {
    try {
      const result = await this.contract.is_resolved();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_IS_RESOLVED");
    }
  }

  async getCollateralTokenMetadata() {
    try {
      const result = await this.contract.get_collateral_token_metadata();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_COLLATERAL_TOKEN_METADATA");
    }
  }

  async getFeeRatio() {
    try {
      const result = await this.contract.get_fee_ratio();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_FEE_RATIO");
    }
  }

  async balanceOf(args: BalanceOfArgs) {
    try {
      const result = await this.contract.balance_of(args);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_BALANCE_OF");
    }
  }

  async getAmountMintable(args: GetAmountMintableArgs) {
    try {
      const result = await this.contract.get_amount_mintable(args);
      console.log(result);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_AMOUNT_MINTABLE");
    }
  }

  async getAmountPayable(args: GetAmountPayableArgs) {
    try {
      const result = await this.contract.get_amount_payable(args);
      console.log(result);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_AMOUNT_PAYABLE");
    }
  }
}
