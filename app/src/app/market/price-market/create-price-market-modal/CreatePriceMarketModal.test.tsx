import { screen, render } from "tests";

import { CreatePriceMarketModal } from "./CreatePriceMarketModal";

describe("CreatePriceMarketModal", () => {
  it("renders children correctly", () => {
    render(<CreatePriceMarketModal>CreatePriceMarketModal</CreatePriceMarketModal>);

    const element = screen.getByText("CreatePriceMarketModal");

    expect(element).toBeInTheDocument();
  });
});
