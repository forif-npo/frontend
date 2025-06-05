"use client";
import { ArrowDropdownIcon } from "@repo/assets/icons/krds";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Label } from "../server/Label";
export interface Option {
  value: string;
  label: string;
}

export type SelectSize = "lg" | "md" | "sm";

export interface SelectProps {
  options: Option[];
  placeholder: string;
  size?: SelectSize;
  value?: string | null;
  onChange?: (value: string) => void;
  variant?: "default" | "text";
}

const sizeClasses = {
  lg: { button: "h-[56px] text-label-l", icon: "h-6 w-6" },
  md: { button: "h-[48px] text-label-m", icon: "h-5 w-5" },
  sm: { button: "h-[40px] text-label-s", icon: "h-4 w-4" },
};

export const Select = ({
  options,
  placeholder,
  size = "md",
  value,
  onChange,
  variant = "default",
}: SelectProps) => {
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(null);
  const selectedValue = isControlled ? value : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (val: string) => {
    if (isControlled) {
      onChange?.(val);
    } else {
      setInternalValue(val);
    }
    setIsOpen(false);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case "Enter":
          if (isOpen && focusedIndex !== null) {
            e.preventDefault();
            handleSelect(options[focusedIndex].value);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
        case "ArrowUp": {
          e.preventDefault();
          const delta = e.key === "ArrowDown" ? 1 : -1;
          setFocusedIndex((prev) => moveFocus(prev, delta, options.length));
          setHoveredIndex(null);
          break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, focusedIndex, options],
  );

  useEffect(() => {
    const selectedIndex = options.findIndex((o) => o.value === selectedValue);
    setFocusedIndex(selectedIndex);
    setHoveredIndex(selectedIndex);
  }, [selectedValue, options]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const labelSize = {
    lg: "l" as const,
    md: "m" as const,
    sm: "s" as const,
  };

  const variantClasses = {
    default:
      "border-gray-30 focus:ring-primary-50 border bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:outline-none",
    text: "hover:bg-gray-5 border-none bg-transparent",
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        ref={triggerRef}
        className={cn(
          "rounded-2 flex w-full min-w-[240px] items-center justify-between px-5 text-left transition duration-150 ease-in-out",
          sizeClasses[size],
          variantClasses[variant],
        )}
      >
        <Label
          size={labelSize[size]}
          className={cn(
            "text-gray-90 flex items-center",
            sizeClasses[size].button,
          )}
        >
          {selectedValue
            ? options.find((o) => o.value === selectedValue)?.label
            : placeholder}
        </Label>
        <span
          className={cn(
            "ml-2 inline-block transform transition-transform",
            isOpen ? "rotate-180" : "rotate-0",
            "text-gray-80",
          )}
        >
          <ArrowDropdownIcon />
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-activedescendant={
            focusedIndex !== null ? `option-${focusedIndex}` : undefined
          }
          className="absolute z-10 mt-2 max-h-60 w-full min-w-[240px] overflow-y-auto rounded-md border border-gray-300 bg-white"
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() =>
                focusedIndex !== index && setHoveredIndex(null)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSelect(option.value);
                }
              }}
              className={`rounded-2 w-full px-5 text-left outline-none ${sizeClasses[size].button} ${
                selectedValue === option.value
                  ? "text-primary-50 bg-primary-5"
                  : "text-gray-90"
              } ${
                hoveredIndex === index || focusedIndex === index
                  ? "bg-primary-5"
                  : ""
              } `}
              role="option"
              aria-selected={selectedValue === option.value}
              tabIndex={isOpen ? 0 : -1}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const moveFocus = (
  currentIndex: number | null,
  delta: number,
  max: number,
): number => {
  if (currentIndex === null) return 0;
  const next = currentIndex + delta;
  if (next < 0) return max - 1;
  if (next >= max) return 0;
  return next;
};
