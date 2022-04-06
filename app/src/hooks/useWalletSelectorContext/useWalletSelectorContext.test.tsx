import { renderHook } from "tests";

import { useWalletSelectorContext } from "./useWalletSelectorContext";

describe("useWalletSelectorContext", () => {
  it("returns a value", async () => {
    const { result } = renderHook(() => useWalletSelectorContext());

    expect(result.current).toEqual("1");
  });
});
