import React, { useState } from "react";

import { FormContext } from "./FormContext";
import { FormContextControllerProps, FormState } from "./FormContext.types";

export const FormContextController = ({ children }: FormContextControllerProps) => {
  const [form, setForm] = useState<FormState | undefined>(undefined);

  const setFieldValue = (field: string, text: string) => {
    form?.mutators.setValue(field, text);
  };

  const props = {
    setForm,
    setFieldValue,
  };

  return <FormContext.Provider value={props}>{children}</FormContext.Provider>;
};
