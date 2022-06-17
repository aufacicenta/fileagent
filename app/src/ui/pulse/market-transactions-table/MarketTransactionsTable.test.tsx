import { screen, render } from "tests";

import { MarketTransactionsTable } from "./MarketTransactionsTable";

describe("MarketTransactionsTable", () => {
  it("renders children correctly", () => {
    render(<MarketTransactionsTable>MarketTransactionsTable</MarketTransactionsTable>);

    const element = screen.getByText("MarketTransactionsTable");

    expect(element).toBeInTheDocument();
  });
});
