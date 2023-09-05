import { FormApi } from "final-form";
import { Dispatch, ReactNode, SetStateAction } from "react";

export type FormState = FormApi<Record<string, any>, Partial<Record<string, any>>>;

export type FormContextControllerProps = {
  children: ReactNode;
};

export type FormContextType = {
  setForm: Dispatch<SetStateAction<FormState | undefined>>;
  setFieldValue: (field: string, text: string) => void;
  updateTextareaHeight: (id?: string) => { textarea: HTMLTextAreaElement; defaultHeight: string };
  resetTextareaHeight: () => void;
};
