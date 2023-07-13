import { screen, render } from "tests";

import { PreviousRoundsTable } from "./PreviousRoundsTable";

describe("PreviousRoundsTable", () => {
  it("renders children correctly", () => {
    render(<PreviousRoundsTable>PreviousRoundsTable</PreviousRoundsTable>);

    const element = screen.getByText("PreviousRoundsTable");

    expect(element).toBeInTheDocument();
  });
});
