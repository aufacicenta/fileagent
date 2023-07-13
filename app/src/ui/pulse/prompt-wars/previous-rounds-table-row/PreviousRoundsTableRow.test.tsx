import { screen, render } from "tests";

import { PreviousRoundsTableRow } from "./PreviousRoundsTableRow";

describe("PreviousRoundsTableRow", () => {
  it("renders children correctly", () => {
    render(<PreviousRoundsTableRow>PreviousRoundsTableRow</PreviousRoundsTableRow>);

    const element = screen.getByText("PreviousRoundsTableRow");

    expect(element).toBeInTheDocument();
  });
});
