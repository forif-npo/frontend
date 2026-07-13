"use client";
import React, { useCallback, useState } from "react";
import { Checkbox as ServerCheckbox } from "../server/Checkbox";

export type InteractiveCheckboxProps = {
  id: string;
  label?: string;
  checked?: boolean;
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
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  size = "md",
  name,
  value,
  onChange,
  className,
}) => {
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const checked = checkedProp ?? uncontrolledChecked;

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    if (checkedProp === undefined) {
      setUncontrolledChecked(next);
    }
    onChange?.(next);
  }, [checked, checkedProp, disabled, onChange]);

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
        checked={checked}
        indeterminate={indeterminate}
        className={className}
      />
    </button>
  );
};
