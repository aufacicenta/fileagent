import { screen, render } from "tests";

import { ImgPromptCard } from "./ImgPromptCard";

describe("ImgPromptCard", () => {
  it("renders children correctly", () => {
    render(<ImgPromptCard>ImgPromptCard</ImgPromptCard>);

    const element = screen.getByText("ImgPromptCard");

    expect(element).toBeInTheDocument();
  });
});
