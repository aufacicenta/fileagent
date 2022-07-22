import { Gas } from "providers/near/types";
import { AccountId } from "../market/market.types";

export type FungibleTokenContractValues = {
  balanceOf: string;
};

export type FungibleTokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  reference: string;
  reference_hash: string;
  decimals: number;
};

export type FtBalanceOfArgs = { account_id: AccountId };
export type FtTransferCallArgs = { receiver_id: AccountId; amount: string; msg: string };

export type FungibleTokenContractMethods = {
  ft_balance_of: (args: FtBalanceOfArgs) => Promise<string>;
  ft_metadata: () => Promise<FungibleTokenMetadata>;
  ft_transfer_call: (args: FtTransferCallArgs, gas?: Gas, deposit?: number) => Promise<string>;
};
