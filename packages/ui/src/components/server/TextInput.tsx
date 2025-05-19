import React, { forwardRef } from "react";
import { Label } from "./Label";

type TextInputProps = {
  id: string;
  title?: string;
  description?: string;
  helpText?: string;
  error?: string;
  length?: "x-short" | "short" | "middle" | "long" | "full";
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      title,
      description,
      helpText,
      error,
      id,
      placeholder,
      length = "middle",
      ...props
    },
    ref,
  ) => {
    const inputId = id;
    const helperTextId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    const lengthClasses = {
      "x-short": "w-16",
      short: "w-32",
      middle: "w-64",
      long: "w-128",
      full: "w-full",
    }[length];

    return (
      <div className="flex flex-col justify-center gap-1">
        {title && (
          <Label htmlFor={inputId} weight="bold">
            {title}
          </Label>
        )}
        {description && (
          <Label size={"s"} color={"gray-50"}>
            {description}
          </Label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="text"
            className={` ${lengthClasses} text-gray-70 rounded-2 focus:border-primary-50 focus:ring-primary-50 mt-3 border px-4 py-3 focus:outline-none focus:ring-1 ${error ? "border-border-danger" : "border-gray-50"} transition duration-150 ease-in-out`}
            placeholder={placeholder}
            aria-describedby={error ? errorId : helperTextId}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
        </div>
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

TextInput.displayName = "TextInput";
