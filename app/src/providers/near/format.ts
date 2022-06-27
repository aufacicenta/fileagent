import BN from "bn.js";
import * as nearAPI from "near-api-js";

export const formatAccountBalance = (balance: string, fracDigits: number = 2) =>
  `${nearAPI.utils.format.formatNearAmount(balance, fracDigits)} NEAR Ⓝ`;

export const formatAccountBalanceFlat = (balance: string, fracDigits: number = 2) =>
  nearAPI.utils.format.formatNearAmount(balance, fracDigits);

export function formatGasValue(gas: string | number): BN {
  return new BN(Number(gas) * 10 ** 12);
}
