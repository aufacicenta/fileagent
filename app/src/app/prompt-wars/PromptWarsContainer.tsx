import dynamic from "next/dynamic";

import { NearMarketContractContextController } from "context/near/market-contract/NearMarketContractContextController";

import { PromptWarsContainerProps, PromptWarsProps } from "./PromptWars.types";

const PromptWars = dynamic<PromptWarsProps>(() => import("./PromptWars").then((mod) => mod.PromptWars), { ssr: false });

export const PromptWarsContainer = ({ marketId }: PromptWarsContainerProps) => (
  <NearMarketContractContextController marketId={marketId}>
    <PromptWars marketId={marketId} />
  </NearMarketContractContextController>
);
