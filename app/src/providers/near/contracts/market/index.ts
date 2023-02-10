import { Contract, WalletConnection } from "near-api-js";
import * as nearAPI from "near-api-js";
import { FinalExecutionOutcome, Wallet } from "@near-wallet-selector/core";
import { BN } from "bn.js";
import { FinalExecutionStatus } from "near-api-js/lib/providers";

import near from "providers/near";
import date from "providers/date";

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

  static async aggregatorRead(wallet: Wallet, contractAddress: AccountId) {
    try {
      const gas = new BN("300000000000000");
      const deposit = "0";

      const response = await wallet.signAndSendTransactions({
        transactions: [
          {
            receiverId: contractAddress,
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "aggregator_read",
                  args: {},
                  gas: gas.toString(),
                  deposit,
                },
              },
            ],
          },
        ],
      });

      const [result] = response as Array<FinalExecutionOutcome>;

      console.log(result);

      if ((result?.status as FinalExecutionStatus)?.SuccessValue) {
        const value = atob((result.status as FinalExecutionStatus)?.SuccessValue!).replaceAll('"', "");

        console.log({ value });
      }
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_AGGREGATOR_READ");
    }
  }

  static async sell(wallet: Wallet, contractAddress: AccountId, args: SellArgs) {
    try {
      const gas = new BN("300000000000000");
      const deposit = "0";

      const response = await wallet.signAndSendTransactions({
        transactions: [
          {
            receiverId: contractAddress,
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "sell",
                  args,
                  gas: gas.toString(),
                  deposit,
                },
              },
            ],
          },
        ],
      });

      const [result] = response as Array<FinalExecutionOutcome>;

      console.log(result);

      if ((result?.status as FinalExecutionStatus)?.SuccessValue) {
        const value = atob((result.status as FinalExecutionStatus)?.SuccessValue!).replaceAll('"', "");

        console.log({ value });
      }
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_SELL");
    }
  }

  async getMarketData() {
    try {
      const result = await this.contract.get_market_data();

      return {
        ...result,
        starts_at: date.extractNanoseconds(result.starts_at),
        ends_at: date.extractNanoseconds(result.ends_at),
      };
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_MARKET_DATA");
    }
  }

  async getPricingData() {
    try {
      const result = await this.contract.get_pricing_data();

      return result || undefined;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_PRICING_DATA");
    }
  }

  async getResolutionData() {
    try {
      const result = await this.contract.get_resolution_data();

      return {
        ...result,
        window: date.extractNanoseconds(result.window),
        resolved_at: result.resolved_at ? date.extractNanoseconds(result.resolved_at) : undefined,
      };
    } catch (error) {
      console.log(error);

      throw new Error("ERR_MARKET_CONTRACT_GET_PRICING_DATA");
    }
  }

  async getResolutionWindow() {
    try {
      const result = await this.contract.resolution_window();

      return date.extractNanoseconds(result);
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_RESOLUTION_WINDOW");
    }
  }

  async getBuySellTimestamp() {
    try {
      const result = await this.contract.get_buy_sell_timestamp();

      return date.extractNanoseconds(result);
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_BUY_SELL_TIMESTAMP");
    }
  }

  async getBlockTimestamp() {
    try {
      const result = await this.contract.get_block_timestamp();

      return date.extractNanoseconds(result);
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_GET_BLOCK_TIMESTAMP");
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
