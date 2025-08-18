"use client";
import React, { useCallback, useState } from "react";
import { Checkbox as ServerCheckbox } from "../server/Checkbox";

export type InteractiveCheckboxProps = {
  id: string;
  label?: string;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: "md" | "lg";
  name?: string;
  value?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
};

// Client wrapper preserving previous controlled-ish API semantics.
export const Checkbox: React.FC<InteractiveCheckboxProps> = ({
  id,
  label,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  size = "md",
  name,
  value,
  onChange,
  className,
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  }, [checked, disabled, onChange]);

  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-disabled={disabled}
      onClick={handleToggle}
      className="inline-flex items-center gap-2 focus:outline-none"
    >
      {/* hidden native input for form compatibility */}
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        className="sr-only"
        aria-hidden="true"
        readOnly
      />
      <ServerCheckbox
        id={`${id}-visual`}
        label={label}
        size={size}
        disabled={disabled}
        defaultChecked={checked}
        indeterminate={indeterminate}
        className={className}
      />
    </button>
  );
};
