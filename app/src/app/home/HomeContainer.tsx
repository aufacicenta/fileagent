import { GenericLoader } from "ui/generic-loader/GenericLoader";
import { PromptWars } from "app/prompt-wars/PromptWars";

import { HomeContainerProps } from "./Home.types";

export const HomeContainer = ({ marketId }: HomeContainerProps) => {
  if (!marketId) {
    return <GenericLoader />;
  }

  return <PromptWars marketId={marketId} />;
};
