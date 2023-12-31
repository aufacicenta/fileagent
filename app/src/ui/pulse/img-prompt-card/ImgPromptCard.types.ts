import { ReactNode } from "react";

import { PromptWarsMarketContractValues } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export type ImgPromptCardProps = {
  onClickCreateNewGame: () => void;
  onClaimDepositUnresolved: () => void;
  onClickSeeResults: () => void;
  marketContractValues: PromptWarsMarketContractValues;
  marketId: string;
  currentResultElement?: ReactNode;
  datesElement?: ReactNode;
  children?: ReactNode;
  className?: string;
};
