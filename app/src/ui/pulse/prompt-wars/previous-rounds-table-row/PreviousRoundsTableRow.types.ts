import { ReactNode } from "react";

import { AccountId } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type PreviousRoundsTableRowProps = {
  marketId: AccountId;
  children?: ReactNode;
  className?: string;
};
