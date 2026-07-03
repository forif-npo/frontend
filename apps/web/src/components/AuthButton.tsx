"use client";
import { Label } from "@ui/components/server";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

export type AuthButtonProps<E extends React.ElementType> = {
  variant?: "primary" | "secondary" | "tertiary" | "text" | "icon";
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  logo: { src: string; alt: string; width: number; height: number };
} & React.ComponentPropsWithoutRef<E>;

const variantStyleMap = {
  primary: {
    style:
      "bg-button-primary-fill hover:bg-button-primary-fill-hover active:bg-button-primary-fill-pressed",
    disabledStyle: "bg-button-disabled-fill",
  },
  secondary: {
    style:
      "bg-button-secondary-fill hover:bg-button-secondary-fill-hover active:bg-button-secondary-fill-pressed border border-button-secondary-border",
    disabledStyle:
      "bg-button-disabled-fill border border-button-disabled-border",
  },
  tertiary: {
    style:
      "bg-button-tertiary-fill hover:bg-button-tertiary-fill-hover active:bg-button-tertiary-fill-pressed border border-button-tertiary-border",
    disabledStyle:
      "bg-button-disabled-fill border border-button-disabled-border",
  },
  text: {
    style:
      "bg-transparent hover:bg-button-text-fill-hover active:bg-button-text-fill-pressed",
    disabledStyle: "text-link-disabled",
  },
  icon: {
    style:
      "bg-transparent hover:bg-button-text-fill-hover active:bg-button-text-fill-pressed",
    disabledStyle: "text-link-disabled",
  },
};

const textColorMap = {
  primary: "text-text-inverse-static",
  secondary: "text-text-primary",
  tertiary: "text-text-basic",
  text: "text-text-basic",
  icon: "flex items-center justify-center",
};

const sizeStyleMap = {
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
};

export const AuthButton = <E extends React.ElementType = "button">({
  variant = "primary",
  size = "large",
  children,
  className = "",
  disabled = false,
  logo,
  ...props
}: AuthButtonProps<E>) => {
  const variantStyles = variantStyleMap[variant];
  const sizeStyles = sizeStyleMap[size];

  const buttonStyles = clsx(
    "inline-flex items-center justify-center gap-2 rounded-2 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors duration-200 cursor-pointer",
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
    textColorMap[variant],
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
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="flex-shrink-0"
      />
      <Label size={sizeStyles.fontSize} className={labelStyles}>
        {children}
      </Label>
    </button>
  );
};
