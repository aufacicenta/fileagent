import { PreviousRounds } from "./PreviousRounds";
import { PreviousRoundsContainerProps } from "./PreviousRounds.types";

export const PreviousRoundsContainer = ({ markets }: PreviousRoundsContainerProps) => (
  <PreviousRounds markets={markets} />
);
