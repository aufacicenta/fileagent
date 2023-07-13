import { screen, render } from "tests";

import { PreviousRounds } from "./PreviousRounds";

describe("PreviousRounds", () => {
  it("renders children correctly", () => {
    render(<PreviousRounds>PreviousRounds</PreviousRounds>);

    const element = screen.getByText("PreviousRounds");

    expect(element).toBeInTheDocument();
  });
});
