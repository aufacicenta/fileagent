import { screen, render } from "tests";

import { Home2 } from "./Home2";

describe("Home2", () => {
  it("renders children correctly", () => {
    render(<Home2>Home2</Home2>);

    const element = screen.getByText("Home2");

    expect(element).toBeInTheDocument();
  });
});
