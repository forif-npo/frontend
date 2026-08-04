import { forwardRef } from "react";
import { HintText } from "../server/HintText";
import { Label } from "../server/Label";
import { Select, SelectProps } from "./Select";

type SelectBoxProps = {
  id: string;
  title?: string;
  description?: string;
  helpText?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
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
      required = false,
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
      <div className="flex flex-col justify-center gap-1">
        {title && (
          <Label htmlFor={id} className="text-text-basic">
            {title}
            {required && (
              <span className="text-text-danger ml-0.5" aria-hidden="true">
                *
              </span>
            )}
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
          ariaRequired={required || undefined}
          {...props}
        />
        {error ? (
          <Label id={errorId} size={"s"} className="text-text-danger mt-1">
            {error}
          </Label>
        ) : helpText ? (
          <HintText id={helperTextId} className="mt-1">
            {helpText}
          </HintText>
        ) : null}
      </div>
    );
  },
);

SelectBox.displayName = "SelectBox";
