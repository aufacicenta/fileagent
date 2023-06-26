import { ReactNode } from "react";

export type PromptInputCardProps = {
  onSubmit: (value: string) => void;
  onClickFAQsButton: () => void;
  children?: ReactNode;
  className?: string;
};
