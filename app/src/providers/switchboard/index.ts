import fetchFeedResult from "./fetchFeedResult";
import fetchCurrentPrice from "./fetchCurrentPrice";
import { BTC_USD } from "./jobs/testnet/near/btc-usd";

export default {
  fetchFeedResult,
  fetchCurrentPrice,
  jobs: {
    testnet: {
      near: {
        btcUsd: BTC_USD,
      },
    },
  },
};
