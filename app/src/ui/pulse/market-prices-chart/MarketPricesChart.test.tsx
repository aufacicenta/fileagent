import { screen, render } from "tests";

import { MarketPricesChart } from "./MarketPricesChart";

describe("MarketPricesChart", () => {
  it("renders children correctly", () => {
    render(<MarketPricesChart>MarketPricesChart</MarketPricesChart>);

    const element = screen.getByText("MarketPricesChart");

    expect(element).toBeInTheDocument();
  });
});
