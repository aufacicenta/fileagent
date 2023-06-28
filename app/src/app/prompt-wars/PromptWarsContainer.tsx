import dynamic from "next/dynamic";

import { NearPromptWarsMarketContractContextController } from "context/near/prompt-wars-market-contract/NearPromptWarsMarketContractContextController";

import { PromptWarsContainerProps, PromptWarsProps } from "./PromptWars.types";

const PromptWars = dynamic<PromptWarsProps>(() => import("./PromptWars").then((mod) => mod.PromptWars), { ssr: false });

export const PromptWarsContainer = ({ marketId }: PromptWarsContainerProps) => (
  <NearPromptWarsMarketContractContextController marketId={marketId}>
    <PromptWars marketId={marketId} />
  </NearPromptWarsMarketContractContextController>
);
