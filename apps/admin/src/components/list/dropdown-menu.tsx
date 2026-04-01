"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error(
      "DropdownMenu components must be used within <DropdownMenu />",
    );
  }

  return context;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleWindowClick = () => setOpen(false);
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div
        className="relative inline-flex"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({
  children,
  asChild = false,
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenuContext();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
    }>;

    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
    });
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export function DropdownMenuContent({
  children,
  align = "end",
  className,
}: DropdownMenuContentProps) {
  const { open } = useDropdownMenuContext();

  if (!open) return null;

  const alignClassName =
    align === "start"
      ? "left-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "right-0";

  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-md border bg-white py-1 shadow-md",
        alignClassName,
        className,
      )}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function DropdownMenuItem({
  children,
  className,
  inset = false,
  onClick,
  disabled = false,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenuContext();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "hover:bg-muted focus:bg-muted flex w-full items-center px-3 py-2 text-left text-sm outline-none transition-colors",
        inset && "pl-8",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="bg-border my-1 h-px w-full" />;
}
