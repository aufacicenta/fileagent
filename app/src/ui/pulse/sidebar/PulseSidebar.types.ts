import { ReactNode } from "react";

export type PulseSidebarProps = {
  className?: string;
  children?: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  handleOpen: () => void;
};
