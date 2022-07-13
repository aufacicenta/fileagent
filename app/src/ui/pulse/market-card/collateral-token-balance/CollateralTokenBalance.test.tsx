import { screen, render } from "tests";

import { CollateralTokenBalance } from "./CollateralTokenBalance";

describe("CollateralTokenBalance", () => {
  it("renders children correctly", () => {
    render(<CollateralTokenBalance>CollateralTokenBalance</CollateralTokenBalance>);

    const element = screen.getByText("CollateralTokenBalance");

    expect(element).toBeInTheDocument();
  });
});
