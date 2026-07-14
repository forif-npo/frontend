import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@repo/core/utils/cn";

export type HintTextProps = ComponentPropsWithoutRef<"p">;

export function HintText({ children, className, ...props }: HintTextProps) {
  return (
    <p
      className={cn("text-text-subtle text-[13px] leading-[1.5]", className)}
      {...props}
    >
      {children}
    </p>
  );
}
