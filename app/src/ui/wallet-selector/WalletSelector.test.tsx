import { screen, render } from "tests";

import { WalletSelector } from "./WalletSelector";

describe("WalletSelector", () => {
  it("renders children correctly", () => {
    render(<WalletSelector>WalletSelector</WalletSelector>);

    const element = screen.getByText("WalletSelector");

    expect(element).toBeInTheDocument();
  });
});
