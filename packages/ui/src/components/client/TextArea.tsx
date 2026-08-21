"use client";
import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { CharacterCount } from "../server/CharacterCount";
import { HintText } from "../server/HintText";
import { Label } from "../server/Label";

type TextAreaProps = {
  id: string;
  title?: string;
  description?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  size?: "small" | "medium" | "large";
  maxLength?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      title,
      description,
      helpText,
      error,
      required = false,
      id,
      placeholder,
      size = "medium",
      maxLength,
      onChange,
      className,
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = useState(0);
    const helperTextId = `${id}-help`;
    const errorId = `${id}-error`;
    const isInvalid = Boolean(error);

    const sizeClasses = {
      small: "h-24",
      medium: "h-32",
      large: "h-40",
    }[size];

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };

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
          <Label size="s" className="text-text-subtle">
            {description}
          </Label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={id}
            aria-describedby={
              error ? errorId : helpText ? helperTextId : undefined
            }
            aria-invalid={isInvalid ? "true" : undefined}
            aria-required={required || undefined}
            required={required}
            className={cn(
              "border-input-border text-gray-70 focus:border-input-border-active focus:ring-border-input-border-active disabled:bg-input-surface-disabled disabled:border-input-border-disabled rounded-2 w-full resize-none border px-4 py-3 transition duration-150 ease-in-out focus:outline-none focus:ring-1",
              sizeClasses,
              isInvalid && "border-input-border-error",
              className,
            )}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={handleChange}
            {...props}
          />
          {maxLength && <CharacterCount count={charCount} max={maxLength} />}
        </div>
        {error ? (
          <Label id={errorId} size="s" className="text-text-danger mt-1">
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

TextArea.displayName = "TextArea";
