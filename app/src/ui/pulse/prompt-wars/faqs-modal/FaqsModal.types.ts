import { ReactNode } from "react";

export type FaqsModalProps = {
  onClose: () => void;
  children?: ReactNode;
  className?: string;
};
