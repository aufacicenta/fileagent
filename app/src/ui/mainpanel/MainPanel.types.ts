import { ReactNode } from "react";

export type MainPanelProps = {
  children: ReactNode;
  className?: string;
};

export type MainPanelContainerProps = {
  paddingX?: boolean;
  children: ReactNode;
  className?: string;
};
