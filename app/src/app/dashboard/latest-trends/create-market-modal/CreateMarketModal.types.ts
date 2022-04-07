import { ReactNode } from "react";

export type CreateMarketModalProps = {
  children?: ReactNode;
  className?: string;
  onClose: () => void;
};
