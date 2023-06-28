import { Contract, WalletConnection } from "near-api-js";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";
import { v4 as uuidv4 } from "uuid";
import { FinalExecutionOutcome, Wallet } from "@near-wallet-selector/core";
import { FinalExecutionStatus } from "near-api-js/lib/providers";

import near from "providers/near";
import { AccountId } from "../market/market.types";

import {
  DeployMarketContractArgs,
  MarketFactoryContractMethods,
  MarketFactoryContractValues,
} from "./market-factory.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class MarketFactoryContract {
  values: MarketFactoryContractValues | undefined;

  contractAddress: string;

  contract?: Contract & MarketFactoryContractMethods;

  wallet?: Wallet;

  constructor(contractAddress: AccountId, contract?: Contract & MarketFactoryContractMethods, wallet?: Wallet) {
    this.contract = contract;
    this.contractAddress = contractAddress;
    this.wallet = wallet;
  }

  static getDefaultContractValues = (): MarketFactoryContractValues => ({
    marketsCount: 0,
  });

  static async loadFromGuestConnection() {
    const connection = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      ...near.getConfig(),
    });

    const account = await connection.account(near.getConfig().guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };
    const contractAddress = near.getConfig().factoryWalletId;

    const contract = near.initContract<MarketFactoryContractMethods>(account, contractAddress, contractMethods);

    return new MarketFactoryContract(near.getConfig().factoryWalletId, contract);
  }

  static async loadFromWalletConnection(connection: WalletConnection, contractAddress: string) {
    const account = await connection.account();
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    return near.initContract<MarketFactoryContractMethods>(account, contractAddress, contractMethods);
  }

  async getMarketsList() {
    try {
      if (this.contract) {
        const result = await this.contract.get_markets_list();

        return result;
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async createMarket(args: DeployMarketContractArgs) {
    try {
      const gas = new BN("300000000000000");

      const storageDeposit = new BN(near.parseNearAmount("0.00235")!);
      const attachedDeposit = new BN(near.parseNearAmount(Number(args.market.options.length + 2).toString())!);
      const deposit = attachedDeposit.add(storageDeposit).toString();

      const name = uuidv4().slice(0, 6);
      const base64args = Buffer.from(JSON.stringify(args)).toString("base64");

      const response = await this.wallet!.signAndSendTransactions({
        transactions: [
          {
            receiverId: this.contractAddress,
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "create_market",
                  args: { name, args: base64args },
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
    }
  }
}
