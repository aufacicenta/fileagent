import { screen, render } from "tests";

import { FaqsModal } from "./FaqsModal";

describe("FaqsModal", () => {
  it("renders children correctly", () => {
    render(<FaqsModal>FaqsModal</FaqsModal>);

    const element = screen.getByText("FaqsModal");

    expect(element).toBeInTheDocument();
  });
});
