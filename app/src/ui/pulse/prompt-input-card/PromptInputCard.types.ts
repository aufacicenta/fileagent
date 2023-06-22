import { ReactNode } from "react";

export type PromptInputCardProps = {
  onSubmit: (value: string) => void;
  children?: ReactNode;
  className?: string;
};
