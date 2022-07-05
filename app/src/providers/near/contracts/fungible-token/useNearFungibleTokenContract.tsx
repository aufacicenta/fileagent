import { useToastContext } from "hooks/useToastContext/useToastContext";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { Typography } from "ui/typography/Typography";
import { AccountId } from "../market/market.types";

import { FungibleTokenContract } from ".";

export default () => {
  const toast = useToastContext();
  const wallet = useWalletStateContext();

  const getWalletBalance = async (contractAddress: AccountId) => {
    if (!wallet.context.get().connection || !wallet.address.get()) {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Failed to fetch collateral token balance",
        children: <Typography.Text>Connect a NEAR wallet and try again.</Typography.Text>,
      });
    }

    const contract = await FungibleTokenContract.loadFromWalletConnection(
      wallet.context.get().connection!,
      contractAddress,
    );

    const balance = await contract.ftBalanceOf({ account_id: wallet.address.get()! });
    const metadata = await contract.ftMetadata();

    if (!metadata) {
      return balance;
    }

    return (Number(balance) / Number("1".padEnd(metadata.decimals + 1, "0"))).toFixed(5);
  };

  return {
    contract: FungibleTokenContract,
    getWalletBalance,
  };
};
