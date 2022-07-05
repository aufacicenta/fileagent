export default () => ({
  COLLATERAL_TOKENS: [
    { icon: "icon-near", price: 1, symbol: "USDT", accountId: "usdt.fakes.testnet" },
    { icon: "icon-near", price: 1, symbol: "PULSE", accountId: "pulse.fakes.testnet" },
    { icon: "icon-near", price: 1, symbol: "REF", accountId: "ref.fakes.testnet" },
    { icon: "icon-near", price: 1, symbol: "CHEDDAR", accountId: "cheddar.fakes.testnet" },
    { icon: "icon-near", price: 1, symbol: "NEAR", accountId: "near.fakes.testnet" },
  ],
  MARKET_CATEGORIES: [
    // @TODO icons should be PNG images paths
    { value: "sports", label: "Sports", icon: "⚽️" },
    { value: "politics", label: "Politics", icon: "🏛" },
    { value: "stocks", label: "Stocks", icon: "🚀" },
    { value: "startups", label: "Startups", icon: "🚀" },
    { value: "crypto", label: "Crypto", icon: "🚀" },
  ],
});
