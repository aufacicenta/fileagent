export const BTC_USD = [
  {
    id: "B8Jddz1N7ipy84vTT5icVVbAiQaSE2c78DrBiQaV9R8v",
    title: "B8Jddz1N7ipy84vTT5icVVbAiQaSE2c78DrBiQaV9R8v",
    tasks: [
      {
        httpTask: {
          url: "https://api.bittrex.com/v3/markets/btc-usd/ticker",
        },
      },
      {
        medianTask: {
          tasks: [
            {
              jsonParseTask: {
                path: "$.askRate",
              },
            },
            {
              jsonParseTask: {
                path: "$.bidRate",
              },
            },
            {
              jsonParseTask: {
                path: "$.lastTradeRate",
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: "Armgk8RF1vJHx1aAkTwd4TWQk5KR5wn1yU5LXZrVVrXy",
    title: "Armgk8RF1vJHx1aAkTwd4TWQk5KR5wn1yU5LXZrVVrXy",
    tasks: [
      {
        httpTask: {
          url: "https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD",
        },
      },
      {
        medianTask: {
          tasks: [
            {
              jsonParseTask: {
                path: "$.result.XXBTZUSD.a[0]",
              },
            },
            {
              jsonParseTask: {
                path: "$.result.XXBTZUSD.b[0]",
              },
            },
            {
              jsonParseTask: {
                path: "$.result.XXBTZUSD.c[0]",
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: "JAe5RMvZwxwuLVrue74CALRTkna5BbEmPHUXWvMKq41s",
    title: "JAe5RMvZwxwuLVrue74CALRTkna5BbEmPHUXWvMKq41s",
    tasks: [
      {
        httpTask: {
          url: "https://www.mexc.com/open/api/v2/market/ticker?symbol=BTC_USDT",
        },
      },
      {
        medianTask: {
          tasks: [
            {
              jsonParseTask: {
                path: "$.data[0].ask",
              },
            },
            {
              jsonParseTask: {
                path: "$.data[0].bid",
              },
            },
            {
              jsonParseTask: {
                path: "$.data[0].last",
              },
            },
          ],
        },
      },
      {
        multiplyTask: {
          aggregatorPubkey: "ETAaeeuQBwsh9mC2gCov9WdhJENZuffRMXY2HgjCcSL9",
        },
      },
    ],
  },
  {
    id: "24tn6V8vSX4ngPq8eCVm9Y7WFW8WW2JD5xiXE38ZWGCN",
    title: "24tn6V8vSX4ngPq8eCVm9Y7WFW8WW2JD5xiXE38ZWGCN",
    tasks: [
      {
        httpTask: {
          url: "https://api-pub.bitfinex.com/v2/tickers?symbols=tBTCUSD",
        },
      },
      {
        medianTask: {
          tasks: [
            {
              jsonParseTask: {
                path: "$[0][1]",
              },
            },
            {
              jsonParseTask: {
                path: "$[0][3]",
              },
            },
            {
              jsonParseTask: {
                path: "$[0][7]",
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: "jWTpkKPBWSB6YvHy3AE8We91fznmhukssKZPDHfgS2a",
    title: "jWTpkKPBWSB6YvHy3AE8We91fznmhukssKZPDHfgS2a",
    tasks: [
      {
        httpTask: {
          url: "https://www.bitstamp.net/api/v2/ticker/btcusd",
        },
      },
      {
        medianTask: {
          tasks: [
            {
              jsonParseTask: {
                path: "$.ask",
              },
            },
            {
              jsonParseTask: {
                path: "$.bid",
              },
            },
            {
              jsonParseTask: {
                path: "$.last",
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: "8szY6hMEmCGSs3zQxBG4G7P6B88rmBA5LCKHavoWgUwr",
    title: "8szY6hMEmCGSs3zQxBG4G7P6B88rmBA5LCKHavoWgUwr",
    tasks: [
      {
        websocketTask: {
          url: "wss://ws.okex.com:8443/ws/v5/public",
          subscription: '{"op":"subscribe","args":[{"channel":"tickers","instId":"BTC-USDT"}]}',
          maxDataAgeSeconds: 15,
          filter:
            "$[?(@.event != 'subscribe' && @.arg.channel == 'tickers' && @.arg.instId == 'BTC-USDT' && @.data[0].instType == 'SPOT' && @.data[0].instId == 'BTC-USDT')]",
        },
      },
      {
        medianTask: {
          tasks: [
            {
              jsonParseTask: {
                path: "$.data[0].bidPx",
              },
            },
            {
              jsonParseTask: {
                path: "$.data[0].askPx",
              },
            },
            {
              jsonParseTask: {
                path: "$.data[0].last",
              },
            },
          ],
        },
      },
      {
        multiplyTask: {
          aggregatorPubkey: "ETAaeeuQBwsh9mC2gCov9WdhJENZuffRMXY2HgjCcSL9",
        },
      },
    ],
  },
  {
    id: "48oFgTf3aZAdryngpKHPgFYkMZGQXdMHtuh1AwEpPk22",
    title: "48oFgTf3aZAdryngpKHPgFYkMZGQXdMHtuh1AwEpPk22",
    tasks: [
      {
        httpTask: {
          url: "https://www.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
        },
      },
      {
        jsonParseTask: {
          path: "$.price",
        },
      },
      {
        multiplyTask: {
          aggregatorPubkey: "ETAaeeuQBwsh9mC2gCov9WdhJENZuffRMXY2HgjCcSL9",
        },
      },
    ],
  },
  {
    id: "AKZgp5JS39ZXTCUnmZaNGeSKgTU5QZUaeX72DrwkGY58",
    title: "AKZgp5JS39ZXTCUnmZaNGeSKgTU5QZUaeX72DrwkGY58",
    tasks: [
      {
        httpTask: {
          url: "https://api.huobi.pro/market/detail/merged?symbol=btcusdt",
        },
      },
      {
        medianTask: {
          tasks: [
            {
              jsonParseTask: {
                path: "$.tick.bid[0]",
              },
            },
            {
              jsonParseTask: {
                path: "$.tick.ask[0]",
              },
            },
          ],
        },
      },
      {
        multiplyTask: {
          aggregatorPubkey: "ETAaeeuQBwsh9mC2gCov9WdhJENZuffRMXY2HgjCcSL9",
        },
      },
    ],
  },
];
