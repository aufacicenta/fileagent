import React, { useState } from "react";
import { setTimeout } from "timers";

import { FormContext } from "./FormContext";
import { FormContextControllerProps, FormState } from "./FormContext.types";

const defaultHeight = "63px";

const updateTextareaHeight = (id: string = "#message") => {
  const textarea = document.querySelector(id)! as HTMLTextAreaElement;

  textarea.style.height = defaultHeight;
  textarea.style.height = `${textarea.scrollHeight}px`;

  return { textarea, defaultHeight };
};

const resetTextareaHeight = (id: string = "#message") => {
  setTimeout(() => {
    const textarea = document.querySelector(id)! as HTMLTextAreaElement;

    textarea.style.height = defaultHeight;
  }, 100);
};

export const FormContextController = ({ children }: FormContextControllerProps) => {
  const [form, setForm] = useState<FormState | undefined>(undefined);

  const setFieldValue = (field: string, text: string) => {
    form?.mutators.setValue(field, text);

    setTimeout(() => {
      updateTextareaHeight();

      form?.focus(field);
    }, 100);
  };

  const props = {
    setForm,
    setFieldValue,
    updateTextareaHeight,
    resetTextareaHeight,
  };

  return <FormContext.Provider value={props}>{children}</FormContext.Provider>;
};
