import { DEFAULT_DECIMALS_PRECISION } from "./constants";

const toUIntAmount = (amount: string | number, decimals: number) => {
  const uIntAmount =
    Number(amount) > 0
      ? (Number(amount) * Number("1".padEnd(decimals + 1, "0"))).toString().replace(".0", "")
      : Number(amount)
          .toFixed(decimals + 1)
          .replace("0.", "");

  return Number(uIntAmount);
};

const fromUIntAmount = (amount: string | number, decimals: number) =>
  (Number(amount) / Number("1".padEnd(decimals + 1, "0"))).toFixed(DEFAULT_DECIMALS_PRECISION);

const toDecimalsPrecisionString = (amount: string, decimals: number) =>
  (Number(amount) / Number("1".padEnd(decimals + 1, "0"))).toFixed(DEFAULT_DECIMALS_PRECISION);

export default {
  toUIntAmount,
  fromUIntAmount,
  toDecimalsPrecisionString,
};
