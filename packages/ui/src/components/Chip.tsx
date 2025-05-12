import React from "react";
import { Label } from "./Label";

export type ChipProps = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onChange: (newCheckedState: boolean) => void;
  id: string;
};

export const Chip: React.FC<ChipProps> = ({
  label,
  checked,
  disabled = false,
  size = "md",
  onChange,
  id,
}) => {
  const sizeClasses = {
    sm: "px-4 h-10",
    md: "px-4 h-12",
    lg: "px-4 h-14",
  };

  const labelSize = {
    sm: "s" as const,
    md: "m" as const,
    lg: "m" as const,
  }[size];
  const labelColor = disabled
    ? "text-disabled"
    : checked
      ? "text-primary"
      : "text-basic";

  const baseClasses = `inline-flex items-center gap-1 rounded-2 border transition-colors duration-200 ${sizeClasses[size]}`;

  const stateClasses = disabled
    ? "bg-surface-gray-subtle text-text-disabled border-border-gray cursor-not-allowed"
    : checked
      ? "bg-action-primary-selected text-text-primary border-border-primary hover:bg-action-primary-hover cursor-pointer"
      : "bg-surface-white text-text-subtle border-border-gray hover:bg-surface-gray-subtle cursor-pointer";

  const iconClasses = disabled
    ? "text-icon-disabled"
    : checked
      ? "text-icon-primary"
      : "text-icon-subtle";

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={handleClick}
        aria-hidden="true"
      />
      <svg
        className={`${iconSizes[size]} ${iconClasses}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M5 13l4 4L19 7"></path>
      </svg>
      <Label
        htmlFor={id}
        size={labelSize}
        className={`text-${labelColor} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {label}
      </Label>
    </div>
  );
};
