import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@repo/core/utils/cn";

export type CharacterCountProps = ComponentPropsWithoutRef<"div"> & {
  count: number;
  max: number;
  countClassName?: string;
  maxClassName?: string;
};

export function CharacterCount({
  count,
  max,
  className,
  countClassName,
  maxClassName,
  ...props
}: CharacterCountProps) {
  return (
    <div
      className={cn("flex justify-end text-[15px] leading-[1.5]", className)}
      {...props}
    >
      <span className={cn("text-text-primary", countClassName)}>{count}</span>
      <span className={cn("text-text-basic", maxClassName)}>{`/${max}`}</span>
    </div>
  );
}
