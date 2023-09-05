import React, { useState } from "react";

import { FormContext } from "./FormContext";
import { FormContextControllerProps, FormState } from "./FormContext.types";

const updateTextareaHeight = (id: string = "#message") => {
  const textarea = document.querySelector(id)! as HTMLTextAreaElement;

  const defaultHeight = "63px";

  textarea.style.height = defaultHeight;
  textarea.style.height = `${textarea.scrollHeight}px`;

  return { textarea, defaultHeight };
};

const resetTextareaHeight = () => {
  setTimeout(() => {
    updateTextareaHeight();
  }, 100);
};

export const FormContextController = ({ children }: FormContextControllerProps) => {
  const [form, setForm] = useState<FormState | undefined>(undefined);

  const setFieldValue = (field: string, text: string) => {
    form?.mutators.setValue(field, text);
  };

  const props = {
    setForm,
    setFieldValue,
    updateTextareaHeight,
    resetTextareaHeight,
  };

  return <FormContext.Provider value={props}>{children}</FormContext.Provider>;
};
