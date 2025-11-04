"use client";

import React, { forwardRef } from "react";
import { Label } from "../server/Label";

type TextInputBaseProps = React.InputHTMLAttributes<HTMLInputElement>;

type TextInputProps = {
  id: string;
  title?: string;
  description?: string;
  helpText?: string;
  error?: string;
  length?: "x-short" | "short" | "middle" | "long" | "full";
  className?: string;
} & Omit<TextInputBaseProps, "id" | "className">;

// Client-side text input with full React event handler support
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      title,
      description,
      helpText,
      error,
      length = "middle",
      className = "",
      type = "text",
      ...inputProps
    },
    ref,
  ) => {
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
          <Label htmlFor={id} className="text-text-basic">
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
            ref={ref}
            id={id}
            type={type}
            aria-describedby={
              error ? errorId : helpText ? helperTextId : undefined
            }
            aria-invalid={error ? "true" : undefined}
            className={`rounded-2 text-gray-70 focus:border-input-border-active focus:ring-border-input-border-active mt-1 border px-4 py-3 transition duration-150 ease-in-out focus:outline-none focus:ring-1 ${
              inputProps.disabled || inputProps.readOnly
                ? "bg-input-surface-disabled border-input-border-disabled"
                : "bg-input-surface border-input-border"
            } ${error ? "border-input-border-error" : ""} ${lengthClasses} ${className}`}
            {...inputProps}
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
  },
);

TextInput.displayName = "TextInput";
