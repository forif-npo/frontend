import {
  InformationFillIcon,
  SuccessFillIcon,
  UrgentBadgeDangerIcon,
} from "@repo/assets/icons/krds";
import { ReactNode } from "react";
import { Heading } from "./Heading";

type AlertVariant = "danger" | "success" | "information";

export type InfoBoxProps = {
  title: string;
  content: ReactNode;
  variant: AlertVariant;
};

const variantClasses: Record<AlertVariant, string> = {
  danger: "text-danger-50",
  information: "text-text-secondary",
  success: "text-success-50",
};

const AlertBadge = ({ variant }: { variant: AlertVariant }) => {
  const variantClass = variantClasses[variant];
  return (
    <>
      {variant === "danger" && (
        <UrgentBadgeDangerIcon
          width={20}
          height={20}
          className={variantClass}
        />
      )}
      {variant === "information" && (
        <InformationFillIcon width={20} height={20} backgroundColor="#052B57" />
      )}
      {variant === "success" && (
        <SuccessFillIcon width={20} height={20} className={variantClass} />
      )}
    </>
  );
};

export function InfoBox({ title, content, variant }: InfoBoxProps) {
  return (
    <div
      role="complementary"
      className="bg-surface-secondary-subtler border-border-secondary-light rounded-3 border px-6 py-4"
    >
      <div className="mb-3 flex flex-row items-center gap-1">
        <AlertBadge variant={variant} />
        <Heading size="xs" className="text-text-secondary">
          {title}
        </Heading>
      </div>
      {content}
    </div>
  );
}
