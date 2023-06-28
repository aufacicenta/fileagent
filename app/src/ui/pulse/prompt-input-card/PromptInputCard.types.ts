import { ReactNode } from "react";

import { Prompt, PromptWarsMarketContractValues } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type PromptInputCardProps = {
  onSubmit: (prompt: Prompt) => void;
  onClickFAQsButton: () => void;
  marketContractValues: PromptWarsMarketContractValues;
  children?: ReactNode;
  className?: string;
};
