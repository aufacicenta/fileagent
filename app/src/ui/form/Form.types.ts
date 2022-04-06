import { FormApi } from "final-form";
import { ReactNode } from "react";

export type FormProps = {
  children: ReactNode;
  className?: string;
  onSubmit: (
    values: Record<string, unknown>,
    form: FormApi,
    callback?: (errors?: Record<string, unknown>) => void,
  ) => Record<string, unknown> | Promise<Record<string, unknown>> | void | Promise<void>;
  validate?: (values: Record<string, unknown>) => Record<string, unknown> | Promise<Record<string, unknown>>;
};
