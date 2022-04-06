import { renderHook } from "tests";

import { useWalletState } from "./useWalletState";

describe("useWalletState", () => {
  it("returns a value", async () => {
    const { result } = renderHook(() => useWalletState());

    expect(result.current).toEqual("1");
  });
});
