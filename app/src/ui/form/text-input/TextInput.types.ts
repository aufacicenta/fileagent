import React from "react";

export type TextInputProps = React.HTMLProps<HTMLInputElement> & {
  id: string;
  labelProps?: {
    text: string;
  };
};
