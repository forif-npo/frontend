import React from "react";
import { Label } from "./Label";

interface TagProps {
  label: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  removable?: boolean; // if true, render a remove button but still no JS handlers (purely visual)
  className?: string;
}

// Server-safe Tag: no interactive callbacks. If you need onClick/onDelete, wrap in a client component.
export const Tag: React.FC<TagProps> = ({
  label,
  size = "medium",
  disabled = false,
  removable = false,
  className = "",
}) => {
  const sizeStyle = {
    small: { size: "s" as const, style: "px-4 py-1 flex gap-1" },
    medium: { size: "m" as const, style: "px-4 py-1 flex gap-1" },
    large: { size: "l" as const, style: "px-4 py-1 flex gap-2" },
  }[size];

  return (
    <span
      className={`inline-flex items-center ${sizeStyle.style} rounded-full ${
        disabled
          ? "border-gray-40 bg-gray-20 cursor-not-allowed border text-gray-50"
          : "border-gray-40 bg-gray-0 text-gray-90 border"
      } ${className}`}
      aria-disabled={disabled || undefined}
    >
      <Label
        size={sizeStyle.size}
        color={disabled ? "gray-50" : "gray-90"}
        className={disabled ? "cursor-not-allowed" : "cursor-default"}
      >
        {label}
      </Label>
      {removable && (
        <span aria-hidden="true" className="ml-1 inline-flex items-center">
          <svg
            className="h-4 w-4"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.293 3.293a1 1 0 011.414 0L8 6.586l3.293-3.293a1 1 0 111.414 1.414L9.414 8l3.293 3.293a1 1 0 01-1.414 1.414L8 9.414l-3.293 3.293a1 1 0 01-1.414-1.414L6.586 8 3.293 4.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </span>
  );
};
