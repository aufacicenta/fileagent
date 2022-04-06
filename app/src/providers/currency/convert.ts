import getBitcoinPrice from "./getBitcoinPrice";

const bitcoin = require("bitcoin-units");

export default {
  btc_usd: async (btc: number) => {
    const price = await getBitcoinPrice();
    const conversion = price * btc;

    return conversion;
  },
  satoshi_btc: (sats: number) => bitcoin(sats, "satoshi").to("btc"),
  btc_satoshi: (btc: number) => bitcoin(btc, "btc").to("satoshi"),
};
