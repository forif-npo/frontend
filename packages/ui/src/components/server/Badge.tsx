import { Label } from "./Label";

import React from "react";

export type BadgeProps = {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "disabled";
  size?: "small" | "medium" | "large";
  appearance?: "fill" | "outline" | "solid-pastel";
  className?: string;
};

const variantStyles = {
  disabled: {
    fill: "bg-element-disabled-light",
    outline: "bg-transparent border border-border-disabled",
    "solid-pastel": "bg-element-disabled-light",
  },
  primary: {
    fill: "bg-primary-50",
    outline: "bg-transparent border border-border-primary",
    "solid-pastel": "bg-primary-5",
  },
  success: {
    fill: "bg-success-50",
    outline: "bg-transparent border border-border-success",
    "solid-pastel": "bg-success-5",
  },
  warning: {
    fill: "bg-warning-50",
    outline: "bg-transparent border border-border-warning",
    "solid-pastel": "bg-warning-5",
  },
  danger: {
    fill: "bg-danger-50",
    outline: "bg-transparent border border-border-danger",
    "solid-pastel": "bg-danger-5",
  },
};

const sizeStyles = {
  small: { padding: "px-2 h-6", fontSize: "s" as const },
  medium: { padding: "px-2 h-[24px]", fontSize: "m" as const },
  large: { padding: "px-2 h-[32px]", fontSize: "l" as const },
};

const textColors = {
  disabled: {
    fill: "text-text-disabled-on",
    outline: "text-text-disabled-on",
    "solid-pastel": "text-text-disabled-on",
  },
  primary: {
    fill: "text-text-basic-inverse",
    outline: "text-text-primary",
    "solid-pastel": "text-text-primary",
  },
  success: {
    fill: "text-text-basic-inverse",
    outline: "text-text-success",
    "solid-pastel": "text-text-success",
  },
  warning: {
    fill: "text-text-basic-inverse",
    outline: "text-text-warning",
    "solid-pastel": "text-text-warning",
  },
  danger: {
    fill: "text-text-basic-inverse",
    outline: "text-text-danger",
    "solid-pastel": "text-text-danger",
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "medium",
  appearance = "fill",
  className = "",
}) => {
  const style = variantStyles[variant]?.[appearance];
  const { padding, fontSize } = sizeStyles[size];
  return (
    <span
      className={`rounded-1 inline-flex items-center justify-center ${style} ${padding} ${className}`}
      role="status"
      aria-label={label}
    >
      <Label size={fontSize} className={textColors[variant][appearance]}>
        {label}
      </Label>
    </span>
  );
};
