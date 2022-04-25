import { screen, render } from "tests";

import { BalancePill } from "./BalancePill";

describe("BalancePill", () => {
  it("renders children correctly", () => {
    render(<BalancePill>BalancePill</BalancePill>);

    const element = screen.getByText("BalancePill");

    expect(element).toBeInTheDocument();
  });
});
