import { renderHook } from "tests";

import { useEvmContract } from "./useEvmContract";

describe("useEvmContract", () => {
  it("returns a value", async () => {
    const { result } = renderHook(() => useEvmContract());

    expect(result.current).toEqual("1");
  });
});
