import { screen, render } from "tests";

import { PriceMarket } from "./PriceMarket";

describe("PriceMarket", () => {
  it("renders children correctly", () => {
    render(<PriceMarket>PriceMarket</PriceMarket>);

    const element = screen.getByText("PriceMarket");

    expect(element).toBeInTheDocument();
  });
});
