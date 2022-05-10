import { screen, render } from "tests";

import { Market } from "./Market";

describe("Market", () => {
  it("renders children correctly", () => {
    render(<Market>Market</Market>);

    const element = screen.getByText("Market");

    expect(element).toBeInTheDocument();
  });
});
