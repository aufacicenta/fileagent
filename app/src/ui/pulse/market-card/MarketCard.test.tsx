import { screen, render } from "tests";

import { MarketCard } from "./MarketCard";

describe("MarketCard", () => {
  it("renders children correctly", () => {
    render(<MarketCard>MarketCard</MarketCard>);

    const element = screen.getByText("MarketCard");

    expect(element).toBeInTheDocument();
  });
});
