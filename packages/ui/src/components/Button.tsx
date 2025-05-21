import clsx from "clsx";
import React from "react";
import { Label } from "./Label";

export type ButtonProps<E extends React.ElementType> = {
  variant?: "primary" | "secondary" | "tertiary" | "text" | "icon";
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<E>;

export const Button = <E extends React.ElementType = "button">({
  variant = "primary",
  size = "large",
  children,
  className = "",
  disabled = false,
  ...props
}: ButtonProps<E>) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors duration-200 cursor-pointer";

  const variantStyles = {
    primary: {
      style:
        "bg-button-primary-fill hover:bg-button-primary-fill-hover active:bg-button-primary-fill-pressed text-text-bolder-inverse",
      disabledStyle: "bg-button-disabled-fill text-text-disabled",
    },
    secondary: {
      style:
        "bg-button-secondary-fill hover:bg-button-secondary-fill-hover active:bg-button-secondary-fill-pressed border border-button-secondary-border text-text-basic",
      disabledStyle:
        "bg-button-disabled-fill border border-button-disabled-border text-text-disabled",
    },
    tertiary: {
      style:
        "bg-button-tertiary-fill hover:bg-button-tertiary-fill-hover active:bg-button-tertiary-fill-pressed border border-button-tertiary-border text-text-basic",
      disabledStyle:
        "bg-button-disabled-fill border border-button-disabled-border text-text-disabled",
    },
    text: {
      style:
        "bg-transparent text-link-default hover:bg-button-text-fill-hover active:bg-button-text-fill-pressed",
      disabledStyle: "text-link-disabled",
    },
    icon: {
      style:
        "bg-transparent text-link-default hover:bg-button-text-fill-hover active:bg-button-text-fill-pressed",
      disabledStyle: "text-link-disabled",
    },
  }[variant];

  const textColors = {
    primary: "text-text-bolder-inverse",
    secondary: "text-text-primary",
    tertiary: "text-text-basic",
    text: "text-text-basic",
    icon: "flex items-center justify-center",
  };

  const sizeStyles: { style: string; fontSize: "l" | "m" | "s" | "xs" } = {
    "x-small": {
      style: "px-2.5 min-w-[32px] min-h-[32px]",
      fontSize: "s" as const,
    },
    small: { style: "px-3 min-w-[40px] min-h-[40px]", fontSize: "s" as const },
    medium: { style: "px-4 min-w-[48px] min-h-[48px]", fontSize: "m" as const },
    large: { style: "px-5 min-w-[56px] min-h-[56px]", fontSize: "l" as const },
    "x-large": {
      style: "px-6 min-w-[64px] min-h-[64px]",
      fontSize: "l" as const,
    },
  }[size];

  const buttonStyles = clsx(
    baseStyles,
    sizeStyles.style,
    disabled ? variantStyles.disabledStyle : variantStyles.style,
    { "cursor-not-allowed": disabled },
    className,
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!disabled) {
        (event.currentTarget as HTMLButtonElement).click();
      }
    }
  };

  const labelStyles = clsx(
    textColors[variant],
    disabled ? "cursor-not-allowed text-text-disabled" : "cursor-pointer",
  );

  return (
    <button
      className={buttonStyles}
      onKeyDown={handleKeyDown}
      role="button"
      disabled={disabled}
      {...props}
    >
      <Label size={sizeStyles.fontSize} className={labelStyles}>
        {children}
      </Label>
    </button>
  );
};
