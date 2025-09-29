import { InformationFillIcon } from "@repo/assets/icons/krds";
import { ReactNode } from "react";
import { Body } from "./Body";

export interface InfoTextProps {
  children: ReactNode;
  iconColor?: "primary" | "secondary";
  className?: string;
}

export function InfoText({
  children,
  iconColor = "primary",
  className = "",
}: InfoTextProps) {
  const iconBgColor =
    iconColor === "primary"
      ? "var(--color-icon-primary)"
      : "var(--color-icon-secondary)";

  return (
    <div className={`mt-6 flex flex-row items-start gap-1 ${className}`}>
      <span className="h-[20px] w-[20px] flex-shrink-0">
        <InformationFillIcon
          width={20}
          height={20}
          backgroundColor={iconBgColor}
        />
      </span>
      <Body size="s" className="text-text-basic">
        {children}
      </Body>
    </div>
  );
}
