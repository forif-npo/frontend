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
    sm: "px-4 h-8",
    md: "px-4 h-9",
    lg: "px-4 h-10",
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

  const baseClasses = `inline-flex items-center gap-2 rounded-3 border transition-colors duration-200 ${sizeClasses[size]}`;

  const stateClasses = disabled
    ? "bg-surface-gray-subtle text-text-disabled border-border-gray cursor-not-allowed"
    : checked
      ? "bg-button-primary-fill text-text-primary border-border-primary hover:bg-button-primary-fill-hover cursor-pointer"
      : "bg-surface-white text-text-subtle border-border-gray hover:bg-surface-gray-subtle cursor-pointer";

  const iconClasses = disabled
    ? "text-icon-disabled"
    : checked
      ? "text-icon-primary"
      : "text-icon-subtle";

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
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
        className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        color={labelColor}
      >
        {label}
      </Label>
    </div>
  );
};
