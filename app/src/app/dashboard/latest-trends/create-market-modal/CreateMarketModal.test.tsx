import { screen, render } from "tests";

import { CreateMarketModal } from "./CreateMarketModal";

describe("CreateMarketModal", () => {
  it("renders children correctly", () => {
    render(<CreateMarketModal>CreateMarketModal</CreateMarketModal>);

    const element = screen.getByText("CreateMarketModal");

    expect(element).toBeInTheDocument();
  });
});
