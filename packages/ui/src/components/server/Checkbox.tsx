import { cn } from "@repo/core/utils/cn";
import React, { forwardRef } from "react";
import { Label } from "./Label";

export type CheckboxStatus = "on" | "off" | "intermediate";

export type CheckboxProps = {
  status: CheckboxStatus;
  label?: string;
  disabled?: boolean;
  size: "md" | "lg";
  id: string;
  onChange: () => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">;

const CheckIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IntermediateIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, size, disabled, status, onChange, name, ...props }, ref) => {
    const sizeClasses = {
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const labelSizeClasses = {
      md: "m" as const,
      lg: "l" as const,
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onChange();
      }
    };

    const baseClasses = `
    inline-flex items-center justify-center border rounded cursor-pointer
    ${sizeClasses[size]} transition-all duration-300 ease-in-out`;

    const stateClasses = disabled
      ? "bg-surface-gray-subtle border-border-gray text-text-disabled cursor-not-allowed"
      : status === "on"
        ? "bg-button-primary-fill border-border-primary text-text-bolder-inverse"
        : status === "intermediate"
          ? "bg-button-primary-fill border-border-primary text-text-bolder-inverse"
          : "bg-surface-white border-border-gray hover:border-border-primary";

    return (
      <div
        className="focus:ring-primary flex items-center gap-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        tabIndex={disabled ? -1 : 0}
        role="checkbox"
        aria-checked={
          status === "on"
            ? "true"
            : status === "intermediate"
              ? "mixed"
              : "false"
        }
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
      >
        <div className={`${baseClasses} ${stateClasses} relative`}>
          <div
            className="absolute inset-0 transition-opacity duration-300 ease-in-out"
            style={{ opacity: status === "on" ? 1 : 0 }}
          >
            <CheckIcon />
          </div>
          <div
            className="absolute inset-0 transition-opacity duration-300 ease-in-out"
            style={{ opacity: status === "intermediate" ? 1 : 0 }}
          >
            <IntermediateIcon />
          </div>
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={status === "on"}
            disabled={disabled}
            className="sr-only"
            onChange={onChange}
            {...props}
          />

          {name && (
            <input
              type="hidden"
              name={name}
              value={status === "on" ? "true" : "false"}
            />
          )}
        </div>
        {label && (
          <Label
            htmlFor={id}
            size={labelSizeClasses[size]}
            className={cn(
              "transition-all duration-300 ease-in-out",
              disabled
                ? "text-text-subtle cursor-not-allowed"
                : "text-text-basic cursor-pointer",
            )}
          >
            {label}
          </Label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
