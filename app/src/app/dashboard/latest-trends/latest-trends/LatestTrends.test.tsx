import { screen, render } from "tests";

import { LatestTrends } from "./LatestTrends";

describe("LatestTrends", () => {
  it("renders children correctly", () => {
    render(<LatestTrends>LatestTrends</LatestTrends>);

    const element = screen.getByText("LatestTrends");

    expect(element).toBeInTheDocument();
  });
});
