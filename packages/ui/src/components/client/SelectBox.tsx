import React, { ChangeEventHandler, forwardRef } from "react";
import { Label } from "../server/Label";
import { Option, Select } from "./Select";

type SelectBoxProps = {
  id: string;
  title?: string;
  description?: string;
  helpText?: string;
  error?: string;
  options: Option[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const SelectBox = forwardRef<HTMLInputElement, SelectBoxProps>(
  (
    {
      title,
      description,
      helpText,
      error,
      id,
      placeholder,
      options,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = id;
    const helperTextId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col justify-center gap-1">
        {title && (
          <Label htmlFor={inputId} weight="bold">
            {title}
          </Label>
        )}
        {description && (
          <Label size={"s"} className="text-text-subtle">
            {description}
          </Label>
        )}
        <Select
          placeholder={placeholder ?? ""}
          options={options}
          onChange={onChange}
        />
        {error ? (
          <Label id={errorId} size={"s"} className="text-text-danger mt-1">
            {error}
          </Label>
        ) : helpText ? (
          <Label id={helperTextId} size={"s"} className="mt-1 text-gray-50">
            {helpText}
          </Label>
        ) : null}
      </div>
    );
  },
);

SelectBox.displayName = "SelectBox";
