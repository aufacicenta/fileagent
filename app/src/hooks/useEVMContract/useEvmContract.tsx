import { useEffect, useState } from "react";

import { useWalletSelectorContext } from "hooks/useWalletSelectorContext/useWalletSelectorContext";
import { AirdropContract } from "providers/web3/contract/airdrop-contract/airdrop-contract";

export const useEvmContract = (name: "AirdropContract" = "AirdropContract") => {
  const [contract, setContract] = useState<AirdropContract | undefined>();

  const wallet = useWalletSelectorContext();

  useEffect(() => {
    if (!wallet.isConnected || !wallet.context.provider) {
      return;
    }

    // @TODO make a factory when we have multiple contract types
    if (name === "AirdropContract") {
      setContract(new AirdropContract(wallet.context.provider));
    }
  }, [name, wallet.context.provider, wallet.isConnected]);

  return contract;
};
