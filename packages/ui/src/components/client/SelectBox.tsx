import { forwardRef } from "react";
import { Label } from "../server/Label";
import { Select, SelectProps } from "./Select";

type SelectBoxProps = {
  id: string;
  title?: string;
  description?: string;
  helpText?: string;
  error?: string;
  invalid?: boolean;
  ariaDescribedBy?: string;
} & SelectProps;

export const SelectBox = forwardRef<HTMLInputElement, SelectBoxProps>(
  (
    {
      title,
      description,
      helpText,
      error,
      invalid = false,
      ariaDescribedBy,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id;
    const helperTextId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const isInvalid = invalid || Boolean(error);

    return (
      <div className="flex h-16 flex-col justify-center gap-1">
        {title && (
          <Label weight="bold" className="text-text-basic">
            {title}
          </Label>
        )}
        {description && (
          <Label size={"s"} className="text-text-subtle">
            {description}
          </Label>
        )}
        <Select
          id={id}
          invalid={isInvalid}
          ariaDescribedBy={error ? errorId : ariaDescribedBy}
          {...props}
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
