import { ReactNode } from "react";

import { PromptWarsMarketContractValues } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type RevealProgressModalProps = {
  onRevealCountdownComplete: () => void;
  onClose: () => void;
  marketContractValues: PromptWarsMarketContractValues;
  children?: ReactNode;
  className?: string;
};
