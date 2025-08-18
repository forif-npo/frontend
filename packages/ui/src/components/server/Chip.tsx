import React from "react";
import { Label } from "./Label";

// Server-safe Chip: no onClick/onChange handlers. Pure HTML semantics using a native checkbox + CSS peer styling.
// State is uncontrolled (defaultChecked). Form submission will include the value when checked.
// If you need controlled / dynamic behavior in React, create a client wrapper that composes this primitive.
export type ChipProps = {
  id: string;
  label: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  defaultChecked?: boolean;
  className?: string;
};

export const Chip: React.FC<ChipProps> = ({
  id,
  label,
  name,
  value = "on",
  disabled = false,
  size = "md",
  defaultChecked = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: { container: "px-4 h-10", icon: "w-3 h-3", label: "s" as const },
    md: { container: "px-4 h-12", icon: "w-4 h-4", label: "m" as const },
    lg: { container: "px-4 h-14", icon: "w-5 h-5", label: "m" as const },
  }[size];

  // Base visual container uses peer-checked classes to reflect state with no JS.
  const baseClasses = `inline-flex items-center gap-1 rounded-2 border transition-colors duration-200 ${sizeClasses.container}`;
  const stateClasses = disabled
    ? "bg-surface-gray-subtle text-text-disabled border-border-gray cursor-not-allowed"
    : `bg-surface-white text-text-subtle border-border-gray hover:bg-surface-gray-subtle cursor-pointer
       peer-checked:bg-action-primary-selected peer-checked:text-text-primary peer-checked:border-border-primary peer-checked:hover:bg-action-primary-hover`;
  const iconColorClasses = disabled
    ? "text-icon-disabled"
    : `text-icon-subtle peer-checked:text-icon-primary`;

  return (
    <div className="inline-flex">
      <input
        id={id}
        name={name}
        value={value}
        type="checkbox"
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="peer sr-only"
        aria-disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`${baseClasses} ${stateClasses} ${className}`}
      >
        <svg
          className={`${sizeClasses.icon} ${iconColorClasses}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        <Label
          size={sizeClasses.label}
          className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          {label}
        </Label>
      </label>
    </div>
  );
};
