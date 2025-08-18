import React from "react";
import { Label } from "./Label";

type TextInputBaseProps = React.InputHTMLAttributes<HTMLInputElement>;

type TextInputProps = {
  id: string;
  title?: string;
  description?: string;
  helpText?: string;
  error?: string;
  length?: "x-short" | "short" | "middle" | "long" | "full";
  className?: string;
} & Pick<
  TextInputBaseProps,
  | "name"
  | "defaultValue"
  | "disabled"
  | "readOnly"
  | "placeholder"
  | "type"
  | "autoComplete"
  | "value"
>;

// Uncontrolled server-safe text input (no React event handlers or controlled value).
export const TextInput: React.FC<TextInputProps> = ({
  id,
  title,
  description,
  helpText,
  error,
  length = "middle",
  name,
  defaultValue,
  disabled,
  readOnly,
  placeholder,
  className = "",
  type = "text",
  autoComplete,
  value,
}) => {
  const helperTextId = `${id}-help`;
  const errorId = `${id}-error`;
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
        <Label htmlFor={id} weight="bold" className="text-text-basic">
          {title}
        </Label>
      )}
      {description && (
        <Label size="s" className="text-text-subtle">
          {description}
        </Label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-describedby={
            error ? errorId : helpText ? helperTextId : undefined
          }
          aria-invalid={error ? "true" : undefined}
          className={`rounded-2 text-gray-70 focus:border-input-border-active focus:ring-border-input-border-active mt-1 border px-4 py-3 transition duration-150 ease-in-out focus:outline-none focus:ring-1 ${
            disabled || readOnly
              ? "bg-input-surface-disabled border-input-border-disabled"
              : "bg-input-surface border-input-border"
          } ${error ? "border-input-border-error" : ""} ${lengthClasses} ${className}`}
        />
      </div>
      {error ? (
        <Label id={errorId} size="s" className="text-text-danger mt-1">
          {error}
        </Label>
      ) : helpText ? (
        <Label id={helperTextId} size="s" className="mt-1 text-gray-50">
          {helpText}
        </Label>
      ) : null}
    </div>
  );
};
