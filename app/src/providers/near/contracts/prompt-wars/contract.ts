import { Contract } from "near-api-js";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";
import { FinalExecutionOutcome, Wallet } from "@near-wallet-selector/core";
import { TypedError } from "near-api-js/lib/providers";

import near from "providers/near";
import date from "providers/date";

import {
  AccountId,
  GetOutcomeTokenArgs,
  OutcomeId,
  OutcomeTokenResult,
  PromptWarsMarketContractMethods,
  PromptWarsMarketContractValues,
} from "./prompt-wars.types";
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

  static async sell(wallet: Wallet, contractAddress: AccountId) {
    try {
      const gas = new BN("300000000000000");
      const deposit = "0";

      const response = await wallet.signAndSendTransaction({
        receiverId: contractAddress,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "sell",
              args: {},
              gas: gas.toString(),
              deposit,
            },
          },
        ],
      });

      near.unwrapFinalExecutionOutcome(response as FinalExecutionOutcome);
    } catch (error) {
      console.log(error);
      throw new Error("ERR_MARKET_CONTRACT_SELL");
    }
  }

  static async reveal(
    contractId: AccountId,
    outcome_id: OutcomeId,
    result: OutcomeTokenResult,
    output_img_uri: string,
  ) {
    console.log(`revealing Prompt Wars prompt result for  with account ${near.getConfig().serverWalletId}`);

    const connection = await near.getPrivateKeyConnection();
    const account = await connection.account(near.getConfig().serverWalletId);

    const methodName = "reveal";

    const gas = new BN("300000000000000");
    const attachedDeposit = new BN("0");

    const args = { outcome_id, result, output_img_uri };

    await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    });
  }

  static async resolve(contractId: AccountId) {
    console.log(`resolving Prompt Wars with account ${near.getConfig().serverWalletId}`);

    const connection = await near.getPrivateKeyConnection();
    const account = await connection.account(near.getConfig().serverWalletId);

    const methodName = "resolve";

    const gas = new BN("300000000000000");
    const attachedDeposit = new BN("0");

    const args = {};

    await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    });
  }

  static async sellResolved(contractId: AccountId) {
    console.log(`calling sell resolved Prompt Wars with account ${near.getConfig().serverWalletId}`);

    const connection = await near.getPrivateKeyConnection();
    const account = await connection.account(near.getConfig().serverWalletId);

    const methodName = "sell";

    const gas = new BN("300000000000000");
    const attachedDeposit = new BN("0");

    const args = {};

    await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    });
  }

  static async claimFees(contractId: AccountId) {
    console.log(`calling claim_fees Prompt Wars with account ${near.getConfig().serverWalletId}`);

    const connection = await near.getPrivateKeyConnection();
    const account = await connection.account(near.getConfig().serverWalletId);

    const methodName = "claim_fees";

    const gas = new BN("300000000000000");
    const attachedDeposit = new BN("0");

    const args = {};

    await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    });
  }

  static async selfDestruct(contractId: AccountId) {
    console.log(`calling self_destruct Prompt Wars with account ${near.getConfig().serverWalletId}`);

    const connection = await near.getPrivateKeyConnection();
    const account = await connection.account(near.getConfig().serverWalletId);

    const methodName = "self_destruct";

    const gas = new BN("300000000000000");
    const attachedDeposit = new BN("0");

    const args = {};

    await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    });
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

  async get_outcome_ids() {
    try {
      const result = await this.contract.get_outcome_ids();

      return result.sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_OUTCOME_IDS");
    }
  }

  async get_outcome_token(args: GetOutcomeTokenArgs) {
    try {
      const result = await this.contract.get_outcome_token(args);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_OUTCOME_TOKEN");
    }
  }

  async get_block_timestamp() {
    try {
      const result = await this.contract.get_block_timestamp();

      return date.extractNanoseconds(result);
    } catch (error) {
      console.log(error);
      throw new Error("ERR_PW_MARKET_CONTRACT_GET_BLOCK_TIMESTAMP");
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

      if ((error as TypedError)?.type === "AccountDoesNotExist") {
        return true;
      }

      throw new Error("ERR_PW_MARKET_CONTRACT_IS_OVER");
    }
  }

  async is_reveal_window_expired() {
    try {
      const result = await this.contract.is_reveal_window_expired();

      return result;
    } catch (error) {
      console.log(error);

      if ((error as TypedError)?.type === "AccountDoesNotExist") {
        return true;
      }

      throw new Error("ERR_PW_MARKET_CONTRACT_IS_REVEAL_WINDOW_EXPIRED");
    }
  }

  async is_resolution_window_expired() {
    try {
      const result = await this.contract.is_resolution_window_expired();

      return result;
    } catch (error) {
      console.log(error);

      if ((error as TypedError)?.type === "AccountDoesNotExist") {
        return true;
      }

      throw new Error("ERR_PW_MARKET_CONTRACT_IS_RESOLUTION_WINDOW_EXPIRED");
    }
  }

  async is_self_destruct_window_expired() {
    try {
      const result = await this.contract.is_self_destruct_window_expired();

      return result;
    } catch (error) {
      console.log(error);

      if ((error as TypedError)?.type === "AccountDoesNotExist") {
        return true;
      }

      throw new Error("ERR_PW_MARKET_CONTRACT_IS_SELF_DESTRUCT_WINDOW_EXPIRED");
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
}
