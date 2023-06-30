import { ReactNode } from "react";

import { PromptWarsMarketContractValues } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type RevealProgressModalProps = {
  onClose: () => void;
  marketContractValues: PromptWarsMarketContractValues;
  children?: ReactNode;
  className?: string;
};
