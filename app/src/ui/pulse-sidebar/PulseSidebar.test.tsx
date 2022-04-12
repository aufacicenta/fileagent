import { screen, render } from "tests";

import { PulseSidebar } from "./PulseSidebar";

describe("PulseSidebar", () => {
  it("renders children correctly", () => {
    render(<PulseSidebar>PulseSidebar</PulseSidebar>);

    const element = screen.getByText("PulseSidebar");

    expect(element).toBeInTheDocument();
  });
});
