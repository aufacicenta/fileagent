import { screen, render } from "tests";

import { MarketOptionsProgress } from "./MarketOptionsProgress";

describe("MarketOptionsProgress", () => {
  it("renders children correctly", () => {
    render(<MarketOptionsProgress>MarketOptionsProgress</MarketOptionsProgress>);

    const element = screen.getByText("MarketOptionsProgress");

    expect(element).toBeInTheDocument();
  });
});
