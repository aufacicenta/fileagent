import { screen, render } from "tests";

import { PromptWars } from "./PromptWars";

describe("PromptWars", () => {
  it("renders children correctly", () => {
    render(<PromptWars>PromptWars</PromptWars>);

    const element = screen.getByText("PromptWars");

    expect(element).toBeInTheDocument();
  });
});
