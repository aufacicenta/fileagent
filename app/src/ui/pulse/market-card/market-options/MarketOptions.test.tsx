import { screen, render } from "tests";

import { MarketOptions } from "./MarketOptions";

describe("MarketOptions", () => {
  it("renders children correctly", () => {
    render(<MarketOptions>MarketOptions</MarketOptions>);

    const element = screen.getByText("MarketOptions");

    expect(element).toBeInTheDocument();
  });
});
