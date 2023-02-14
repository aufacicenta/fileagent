import currency from "providers/currency";
import date from "providers/date";
import { MarketContract } from "../market";
import { MarketData, Pricing } from "../market/market.types";

export class PriceMarketContract extends MarketContract {
  static getDescription(market: MarketData, price: Pricing) {
    return date.now().valueOf() > market.ends_at
      ? `Will ${price.base_currency_symbol} be above ${currency.convert.toFormattedString(price.value)}?`
      : `Will ${price.base_currency_symbol} be above ${currency.convert.toFormattedString(
          price.value,
        )} ${date.timeFromNow.asDefault(market.ends_at)}?`;
  }
}
