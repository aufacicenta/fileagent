import React, { ReactNode } from "react";
import { SupportedInputs } from "react-final-form";

export type TextInputProps = React.HTMLProps<HTMLInputElement> & {
  id: string;
  children?: ReactNode;
  component?: SupportedInputs;
};
