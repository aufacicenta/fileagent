import { screen, render } from "tests";

import { WalletSelectorNavbar } from "./WalletSelectorNavbar";

describe("WalletSelectorNavbar", () => {
  it("renders children correctly", () => {
    render(<WalletSelectorNavbar>WalletSelectorNavbar</WalletSelectorNavbar>);

    const element = screen.getByText("WalletSelectorNavbar");

    expect(element).toBeInTheDocument();
  });
});
