import clsx from "clsx";
import { Field } from "react-final-form";

import { TextInputProps } from "./TextInput.types";
import styles from "./TextInput.module.scss";

export const TextInput: React.FC<TextInputProps> = ({ className, id, labelProps, type, ...props }) => (
  <div className={clsx(styles["text-input"], "input-field", className)}>
    <Field
      id={id}
      name={id}
      component="input"
      type={type}
      className={clsx(styles["text-input"], "validate")}
      autoFocus={props.autoFocus}
    />
    {props.label && <label htmlFor={id}>{props.label}</label>}
  </div>
);
