import * as nearAPI from "near-api-js";
import { Account, Contract } from "near-api-js";
import { ContractMethods } from "near-api-js/lib/contract";

export default function initContract<M>(
  account: Account,
  contractAddress: string,
  contractMethods: ContractMethods,
): Contract & M {
  const contract = new nearAPI.Contract(account, contractAddress, contractMethods);

  return contract as Contract & M;
}
