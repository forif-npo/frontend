import React from "react";
import { Label } from "./Label";

// Server-safe, uncontrolled checkbox.
// For an indeterminate (mixed) visual state without JS, we allow a static `indeterminate` prop that only affects initial appearance.
// If you need dynamic toggling logic in React, wrap this in a client component and control via refs.
export type CheckboxProps = {
  id: string;
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean; // static presentation only
  size?: "md" | "lg";
  className?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  name,
  value = "on",
  checked,
  defaultChecked = false,
  disabled = false,
  indeterminate = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    md: { box: "w-5 h-5", label: "m" as const, icon: "w-3 h-3" },
    lg: { box: "w-6 h-6", label: "l" as const, icon: "w-4 h-4" },
  }[size];
  const checkedProps =
    checked === undefined ? { defaultChecked } : { checked, readOnly: true };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative inline-flex items-center justify-center">
        <input
          id={id}
          name={name}
          value={value}
          type="checkbox"
          {...checkedProps}
          disabled={disabled}
          aria-disabled={disabled}
          aria-checked={indeterminate ? "mixed" : undefined}
          className="peer sr-only"
          data-indeterminate={indeterminate ? "true" : undefined}
        />
        <span
          aria-hidden="true"
          className={`flex items-center justify-center rounded border transition-colors duration-200 ${sizeClasses.box} ${disabled ? "cursor-not-allowed" : "cursor-pointer"} bg-surface-white border-border-gray peer-hover:border-border-primary peer-checked:bg-button-primary-fill peer-checked:border-border-primary peer-disabled:bg-surface-gray-subtle peer-disabled:border-border-gray peer-disabled:text-text-disabled`}
        />
        {/* Check icon */}
        <svg
          className={`pointer-events-none absolute left-1/2 top-1/2 ${sizeClasses.icon} -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity duration-150 ease-in-out ${indeterminate ? "" : "peer-checked:opacity-100"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6L9 17L4 12" />
        </svg>
        {/* Indeterminate icon */}
        <svg
          className={`pointer-events-none absolute left-1/2 top-1/2 ${sizeClasses.icon} -translate-x-1/2 -translate-y-1/2 text-white transition-opacity duration-150 ease-in-out ${indeterminate ? "opacity-100" : "opacity-0"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12H19" />
        </svg>
      </span>
      {label && (
        <Label
          size={sizeClasses.label}
          htmlFor={id}
          className={
            disabled
              ? "text-text-subtle cursor-not-allowed"
              : "text-text-basic cursor-pointer"
          }
        >
          {label}
        </Label>
      )}
    </div>
  );
};
