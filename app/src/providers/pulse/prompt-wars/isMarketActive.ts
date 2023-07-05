import { PromptWarsMarketContract } from "providers/near/contracts/prompt-wars/contract";
import { AccountId } from "providers/near/contracts/prompt-wars/prompt-wars.types";

export default async (marketId: AccountId) => {
  const latestMarketContract = await PromptWarsMarketContract.loadFromGuestConnection(marketId!);

  const [is_over, is_reveal_window_expired, is_resolution_window_expired] = await Promise.all([
    latestMarketContract.is_over(),
    latestMarketContract.is_reveal_window_expired(),
    latestMarketContract.is_resolution_window_expired(),
  ]);

  return !is_over || !is_reveal_window_expired || !is_resolution_window_expired;
};
