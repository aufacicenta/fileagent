import * as nearAPI from "near-api-js";

export default async (near: nearAPI.Near, accountId: string) => {
  const account = await near.account(accountId);

  return account.getAccountBalance();
};
