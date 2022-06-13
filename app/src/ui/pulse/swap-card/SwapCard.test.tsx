import { screen, render } from "tests";

import { SwapCard } from "./SwapCard";

describe("SwapCard", () => {
  it("renders children correctly", () => {
    render(<SwapCard>SwapCard</SwapCard>);

    const element = screen.getByText("SwapCard");

    expect(element).toBeInTheDocument();
  });
});
