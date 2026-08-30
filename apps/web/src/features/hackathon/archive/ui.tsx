import { cn } from "@repo/core/utils/cn";
import type { MouseEventHandler } from "react";

export const ARCHIVE_PANEL_CLASS_NAME =
  "rounded-3 border-border-gray-light bg-surface-white border";
export const ARCHIVE_ELEVATED_PANEL_CLASS_NAME = `${ARCHIVE_PANEL_CLASS_NAME} shadow-sm`;

export const ARCHIVE_FILTER_WIDTH_CLASS_NAME = {
  hackathon: "w-[280px]",
  techStack: "w-[208px]",
  competitionType: "w-[208px]",
} as const;

export const ARCHIVE_CARD_SUMMARY_MIN_HEIGHT_CLASS_NAME = "min-h-[60px]";
export const ARCHIVE_CARD_LINKS_CLASS_NAME =
  "border-divider-gray-light flex min-h-[45px] flex-wrap gap-2 border-t pt-3";

interface ArchiveTechStackBadgesProps {
  techStacks: string[];
}

export function ArchiveTechStackBadges({
  techStacks,
}: ArchiveTechStackBadgesProps) {
  return techStacks.map((tech) => (
    <span
      key={tech}
      className="bg-surface-primary-subtler text-text-primary text-label-xs inline-flex h-6 items-center rounded-full px-2.5 font-semibold"
    >
      {tech}
    </span>
  ));
}

interface ArchiveExternalLink {
  label: string;
  href?: string | null;
}

interface ArchiveExternalLinksProps {
  links: ArchiveExternalLink[];
  size: "small" | "medium";
  className?: string;
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
}

const linkClassNameBySize = {
  small:
    "rounded-2 border-border-gray-light text-label-xs text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-8 items-center border px-3 font-semibold transition-colors",
  medium:
    "rounded-2 border-border-gray-light text-label-s text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-10 items-center border px-4 font-semibold transition-colors",
};

export function ArchiveExternalLinks({
  links,
  size,
  className,
  onLinkClick,
}: ArchiveExternalLinksProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map(
        ({ label, href }) =>
          href && (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onLinkClick}
              className={linkClassNameBySize[size]}
            >
              {label}
            </a>
          ),
      )}
    </div>
  );
}
