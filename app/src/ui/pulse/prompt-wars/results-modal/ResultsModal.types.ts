import { ReactNode } from "react";

import { OutcomeId, PromptWarsMarketContractValues } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type ResultsModalProps = {
  onClose: () => void;
  marketContractValues: PromptWarsMarketContractValues;
  children?: ReactNode;
  className?: string;
};

export type ResultsModalOutcomeToken = {
  outcomeId: OutcomeId;
  outputImgUrl: string;
  prompt: string;
  negativePrompt: string;
  result: number;
};
