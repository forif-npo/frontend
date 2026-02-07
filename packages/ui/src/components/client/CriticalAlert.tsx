import { cn } from "../../utils/cn";
import { Label } from "../server/Label";
import { LinkButton } from "../server/LinkButton";

type AlertVariant = "danger" | "success" | "information";

export type CriticalAlertProps = {
  text: string;
  variant: AlertVariant;
  link?: string;
  detailText?: string;
  title?: string;
  className?: string;
};

const ALERT_TAG_MAP: Record<AlertVariant, string> = {
  danger: "긴급",
  success: "안전",
  information: "안내",
} as const;

const variantClaases: Record<AlertVariant, string> = {
  danger: "bg-danger-50",
  information: "bg-information-50",
  success: "bg-success-50",
};

export const CriticalAlert = ({
  text,
  variant,
  link,
  title,
  detailText = "자세히보기",
  className,
}: CriticalAlertProps) => {
  return (
    <div
      className={`border-border-gray-light bg-surface-white w-full rounded-[10px] border p-4 ${className} `}
    >
      <div className={`flex items-center gap-4`}>
        <UrgentBadge variant={variant} />
        <Label className="text-text-bolder flex-1" size="m" weight="bold">
          {text}
        </Label>
        <div className="hidden shrink-0 md:block">
          {link && <MoreLinkButton link={link} title={title} />}
        </div>
        <div className="block shrink-0 md:hidden">
          {link && (
            <LinkButton
              title={detailText}
              href={link}
              style={{
                textDecoration: "none",
              }}
            >
              <ArrowIcon />
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
};

const UrgentBadge = ({ variant }: { variant: AlertVariant }) => {
  const tag = ALERT_TAG_MAP[variant];

  return (
    <span
      className={cn(
        "inline-flex h-[48px] shrink-0 items-center justify-center gap-1 rounded-[6px] px-[10px] py-2",
        variantClaases[variant],
      )}
    >
      {variant === "information" && <InfoIcon />}
      {variant === "success" && <OkIcon />}
      {variant === "danger" && <DangerIcon />}
      <Label className="text-text-inverse-static" size="s" weight="bold">
        {tag}
      </Label>
    </span>
  );
};

const MoreLinkButton = ({ link, title }: { link: string; title?: string }) => {
  return (
    <LinkButton
      href={link}
      title={title}
      style={{
        textDecoration: "none",
      }}
    >
      <Label
        size="m"
        className="text-text-basic hidden cursor-pointer md:inline-block"
      >
        자세히보기
      </Label>
      <ArrowIcon />
    </LinkButton>
  );
};

const InfoIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="info icon"
  >
    <rect
      x="0.8"
      y="-0.8"
      width="18.4"
      height="18.4"
      rx="9.2"
      transform="matrix(1 0 0 -1 2 20.4)"
      fill="white"
      stroke="white"
    />
    <rect x="11.3008" y="10.4297" width="1.8" height="5.6" fill="#16408D" />
    <rect x="10.1992" y="10.4297" width="2" height="1.2" fill="#16408D" />
    <rect x="10" y="15.5938" width="4" height="1.2" fill="#16408D" />
    <circle cx="11.8992" cy="8.23906" r="1.2" fill="#16408D" />
  </svg>
);

const DangerIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0001 2.84448V5.64136M5.31421 6.95547L3 4.84448M18.6859 6.95547L21 4.84448"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.99236 21.1556H20.0083C20.6156 21.1556 20.9193 21.1556 21.122 21.0289C21.2995 20.9179 21.4288 20.7442 21.4841 20.5423C21.5472 20.3117 21.4599 20.0209 21.2854 19.4391L20.6362 17.2751C20.5428 16.9637 20.4961 16.808 20.4076 16.6898C20.3108 16.5603 20.1784 16.4618 20.0266 16.4063C19.888 16.3556 19.7254 16.3556 19.4003 16.3556H4.60032C4.27523 16.3556 4.11268 16.3556 3.97401 16.4063C3.82222 16.4618 3.68985 16.5603 3.59303 16.6898C3.50459 16.808 3.45788 16.9637 3.36447 17.2751L2.71526 19.4391C2.54073 20.0209 2.45347 20.3117 2.51659 20.5423C2.57186 20.7442 2.70111 20.9179 2.87863 21.0289C3.08131 21.1556 3.385 21.1556 3.99236 21.1556Z"
      fill="white"
    />
    <path
      d="M18.8137 12.6682C19.0062 13.3098 18.5266 13.9556 17.8568 13.9556C16.34 13.9556 13.8435 13.9556 11.9999 13.9556C10.1563 13.9556 7.65985 13.9556 6.14308 13.9556C5.47322 13.9556 4.99365 13.3098 5.18613 12.6682L6.38613 8.66822C6.51303 8.24523 6.90235 7.95557 7.34396 7.95557H16.6559C17.0975 7.95557 17.4868 8.24523 17.6137 8.66822L18.8137 12.6682Z"
      fill="white"
    />
  </svg>
);

const OkIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6547 4.48297C11.2526 3.44734 12.7474 3.44734 13.3453 4.48297L20.9884 17.7211C21.5863 18.7567 20.8389 20.0513 19.643 20.0513H4.35696C3.16111 20.0513 2.41371 18.7567 3.01163 17.7211L10.6547 4.48297Z"
      fill="white"
      stroke="white"
    />
    <rect x="11" y="8.52344" width="2" height="5.6" fill="#005713" />
    <rect x="11" y="15.8203" width="2" height="2" fill="#005713" />
  </svg>
);

const ArrowIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.1523 13.6L16.9523 9.99998L13.1523 6.39998"
      stroke="#2D2D2D"
      strokeLinecap="round"
    />
    <line
      x1="17"
      y1="9.99687"
      x2="2"
      y2="9.99687"
      stroke="#2D2D2D"
      strokeLinecap="round"
    />
  </svg>
);
