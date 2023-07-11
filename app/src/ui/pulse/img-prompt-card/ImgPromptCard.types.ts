import { ReactNode } from "react";

import { PromptWarsMarketContractValues } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type ImgPromptCardProps = {
  onNextGameCountdownComplete: () => void;
  onClaimDepositUnresolved: () => void;
  onClaimDepositResolved: () => void;
  onClickSeeResults: () => void;
  marketContractValues: PromptWarsMarketContractValues;
  marketId: string;
  currentResultElement?: ReactNode;
  datesElement?: ReactNode;
  children?: ReactNode;
  className?: string;
};
