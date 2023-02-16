import { screen, render } from "tests";

import { PriceMarketTableRow } from "./PriceMarketTableRow";

describe("PriceMarketTableRow", () => {
  it("renders children correctly", () => {
    render(<PriceMarketTableRow>PriceMarketTableRow</PriceMarketTableRow>);

    const element = screen.getByText("PriceMarketTableRow");

    expect(element).toBeInTheDocument();
  });
});
