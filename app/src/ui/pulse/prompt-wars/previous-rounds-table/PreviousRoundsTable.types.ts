import { ReactNode } from "react";

import { AccountId } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type PreviousRoundsTableProps = {
  markets: Array<AccountId>;
  children?: ReactNode;
  className?: string;
};
