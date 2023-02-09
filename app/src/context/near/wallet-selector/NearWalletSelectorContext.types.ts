import { WalletSelector } from "@near-wallet-selector/core";
import { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { ReactNode } from "react";

export type NearWalletSelectorContextControllerProps = {
  children: ReactNode;
};

export type NearWalletSelectorContextType = {
  selector?: WalletSelector;
  modal?: WalletSelectorModal;
  initModal: (contractId: string) => void;
  signOut: () => Promise<void>;
};

export type NEARSignInOptions = {
  contractId?: string;
  methodNames?: string[];
  successUrl?: string;
  failureUrl?: string;
};
