import { ReactNode } from "react";

export type SwapCardProps = {
  onSubmit: (values: Record<string, unknown>) => void;
  children?: ReactNode;
  className?: string;
};
