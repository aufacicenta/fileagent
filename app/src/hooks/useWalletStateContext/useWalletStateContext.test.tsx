import { renderHook } from "tests";

import { useWalletStateContext } from "./useWalletStateContext";

describe("useWalletStateContext", () => {
  it("returns a value", async () => {
    const { result } = renderHook(() => useWalletStateContext());

    expect(result.current).toEqual("1");
  });
});
