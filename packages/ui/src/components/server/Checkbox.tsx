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

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative inline-flex items-center justify-center">
        <input
          id={id}
          name={name}
          value={value}
          type="checkbox"
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-disabled={disabled}
          aria-checked={indeterminate ? "mixed" : undefined}
          className="peer sr-only"
          data-indeterminate={indeterminate ? "true" : undefined}
        />
        <span
          aria-hidden="true"
          className={`relative flex items-center justify-center rounded border transition-colors duration-200 ${sizeClasses.box} ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${
            defaultChecked
              ? "bg-button-primary-fill border-border-primary"
              : "bg-surface-white border-border-gray"
          } ${disabled ? "bg-surface-gray-subtle border-border-gray text-text-disabled" : ""}`}
        >
          {/* Check icon */}
          <svg
            className={`absolute ${sizeClasses.icon} text-text-bolder-inverse transition-opacity duration-150 ease-in-out ${defaultChecked && !indeterminate ? "opacity-100" : "opacity-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17L4 12" />
          </svg>
          {/* Indeterminate icon */}
          <svg
            className={`absolute ${sizeClasses.icon} text-text-bolder-inverse transition-opacity duration-150 ease-in-out ${indeterminate ? "opacity-100" : "opacity-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12H19" />
          </svg>
        </span>
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
