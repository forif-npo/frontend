import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // optional link; if absent rendered as plain text
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  maxLength?: number;
}

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M6 4L10 8L6 12"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EllipsisIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="13" cy="8" r="1" fill="currentColor" />
  </svg>
);

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  maxLength = 3,
}) => {
  const maxItems = Math.max(2, maxLength);

  const computeVisible = () => {
    if (items.length <= maxItems) return items;
    const visible: BreadcrumbItem[] = [items[0]];
    if (maxItems > 2) {
      for (let i = 1; i < maxItems - 1; i++) {
        visible.push(items[items.length - maxItems + i]);
      }
    }
    visible.push(items[items.length - 1]);
    return visible;
  };

  const visibleItems = computeVisible();

  return (
    <nav aria-label="breadcrumb" className="py-2">
      <ol className="flex items-center" role="list">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          return (
            <li key={index} className="m-0 flex items-center">
              {index > 0 && <ChevronIcon className="text-text-basic" />}
              {index === 1 && items.length > maxItems && (
                <>
                  <EllipsisIcon className="text-text-basic" />
                  <ChevronIcon className="text-text-basic" />
                </>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-text-basic focus:ring-border-primary text-xs hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`text-text-basic text-xs ${isLast ? "font-semibold" : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
