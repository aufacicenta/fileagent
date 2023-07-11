import { ReactNode } from "react";

import { AccountId } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type CollateralTokenBalanceProps = {
  accountId: AccountId;
  contractAddress: AccountId;
  children?: ReactNode;
  className?: string;
};
