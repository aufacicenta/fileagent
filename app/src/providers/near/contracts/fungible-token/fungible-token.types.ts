import { AccountId } from "../market/market.types";

export type FungibleTokenContractValues = {
  balanceOf: string;
};

export type FtBalanceOfArgs = { account_id: AccountId };
export type FtTransferCallArgs = { receiver_id: AccountId; amount: string; msg: string };

export type FungibleTokenContractMethods = {
  ft_balance_of: (args: FtBalanceOfArgs) => Promise<string>;
  ft_transfer_call: (args: FtTransferCallArgs, gas?: number, deposit?: number) => Promise<string>;
};
