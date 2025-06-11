import { cn } from "@repo/core/utils/cn";
import React from "react";

interface DividerProps {
  full?: boolean;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  full = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        `border-divider-gray-light border-t`,
        full ? "w-full" : "w-1/2",
        className,
      )}
    />
  );
};
