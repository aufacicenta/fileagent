import { screen, render } from "tests";

import { LatestPriceMarketsTable } from "./LatestPriceMarketsTable";

describe("LatestPriceMarketsTable", () => {
  it("renders children correctly", () => {
    render(<LatestPriceMarketsTable>LatestPriceMarketsTable</LatestPriceMarketsTable>);

    const element = screen.getByText("LatestPriceMarketsTable");

    expect(element).toBeInTheDocument();
  });
});
