import { ReactNode } from "react";

import { AccountId } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type HomeProps = {
  marketId: string;
  children?: ReactNode;
  className?: string;
};

export type HomeContainerProps = {
  marketId: AccountId;
  children?: ReactNode;
  className?: string;
};
