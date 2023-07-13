import { ReactNode } from "react";

import { AccountId } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type PreviousRoundsProps = {
  markets: Array<AccountId>;
  children?: ReactNode;
  className?: string;
};

export type PreviousRoundsContainerProps = {
  markets: Array<AccountId>;
  children?: ReactNode;
  className?: string;
};
