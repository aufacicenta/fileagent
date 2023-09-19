import { FinalExecutionOutcome } from "@near-wallet-selector/core";
import { FinalExecutionStatus } from "near-api-js/lib/providers";

export default function unwrapFinalExecutionOutcome(result: FinalExecutionOutcome): string | undefined {
  console.log(result);

  if ((result?.status as FinalExecutionStatus)?.SuccessValue) {
    const value = atob((result.status as FinalExecutionStatus)?.SuccessValue!).replaceAll('"', "");

    console.log({ value });

    return value;
  }

  return undefined;
}
