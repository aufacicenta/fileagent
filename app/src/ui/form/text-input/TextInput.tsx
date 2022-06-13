import clsx from "clsx";
import { Field } from "react-final-form";

import { TextInputProps } from "./TextInput.types";
import styles from "./TextInput.module.scss";

export const TextInput: React.FC<TextInputProps> = ({
  className,
  id,
  type,
  placeholder,
  name,
  value,
  children,
  ...props
}) => (
  <div className={clsx(styles["text-input"], "input-field", className)}>
    <Field
      id={id}
      name={name || id}
      component="input"
      type={type}
      className={clsx(styles["text-input__field"], "validate")}
      autoFocus={props.autoFocus}
      placeholder={placeholder}
      value={value}
    />
    {children && children}
  </div>
);
