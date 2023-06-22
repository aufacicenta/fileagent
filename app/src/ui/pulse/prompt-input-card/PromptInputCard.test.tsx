import { screen, render } from "tests";

import { PromptInputCard } from "./PromptInputCard";

describe("PromptInputCard", () => {
  it("renders children correctly", () => {
    render(<PromptInputCard>PromptInputCard</PromptInputCard>);

    const element = screen.getByText("PromptInputCard");

    expect(element).toBeInTheDocument();
  });
});
