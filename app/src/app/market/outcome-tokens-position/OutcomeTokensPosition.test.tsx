import { screen, render } from "tests";

import { OutcomeTokensPosition } from "./OutcomeTokensPosition";

describe("OutcomeTokensPosition", () => {
  it("renders children correctly", () => {
    render(<OutcomeTokensPosition>OutcomeTokensPosition</OutcomeTokensPosition>);

    const element = screen.getByText("OutcomeTokensPosition");

    expect(element).toBeInTheDocument();
  });
});
