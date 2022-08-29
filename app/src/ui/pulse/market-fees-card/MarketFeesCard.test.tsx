import { screen, render } from "tests";

import { MarketFeesCard } from "./MarketFeesCard";

describe("MarketFeesCard", () => {
  it("renders children correctly", () => {
    render(<MarketFeesCard>MarketFeesCard</MarketFeesCard>);

    const element = screen.getByText("MarketFeesCard");

    expect(element).toBeInTheDocument();
  });
});
