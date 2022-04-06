import { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type GeneralProps = {
  inline?: boolean;
  flat?: boolean;
  truncate?: boolean;
};

export type TypographyProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  className?: string;
} & GeneralProps;

export type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & GeneralProps;
