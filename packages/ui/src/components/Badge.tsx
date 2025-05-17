import React from "react";
import { Label } from "./Label";

export type BadgeProps = {
  label: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "x-small" | "small" | "medium" | "large";
  appearance?: "fill" | "stroke";
  className?: string;
};

const variantStyles = {
  default: {
    fill: "bg-surface-gray-subtle",
    stroke: "bg-transparent border border-border-gray",
  },
  primary: {
    fill: "bg-surface-primary-subtler",
    stroke: "bg-transparent border border-border-primary",
  },
  success: {
    fill: "bg-surface-success-subtler",
    stroke: "bg-transparent border border-border-success",
  },
  warning: {
    fill: "bg-surface-warning-subtler",
    stroke: "bg-transparent border border-border-warning",
  },
  danger: {
    fill: "bg-surface-danger-subtler",
    stroke: "bg-transparent border border-border-danger",
  },
};

const sizeStyles = {
  "x-small": { padding: "px-3 py-1", fontSize: "xs" as const },
  small: { padding: "px-3 py-1", fontSize: "s" as const },
  medium: { padding: "px-4 py-2", fontSize: "m" as const },
  large: { padding: "px-4 py-2", fontSize: "l" as const },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "small",
  appearance = "fill",
  className = "",
}) => {
  const style = variantStyles[variant][appearance];
  const { padding, fontSize } = sizeStyles[size];

  return (
    <span
      className={`rounded-2 inline-flex items-center justify-center ${style} ${padding} ${className}`}
      role="status"
      aria-label={label}
    >
      <Label size={fontSize}>{label}</Label>
    </span>
  );
};
