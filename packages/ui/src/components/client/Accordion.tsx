"use client";
import React, { useRef, useState } from "react";
import { Label } from "../server/Label";

const ChevronIcon: React.FC<{ isOpen: boolean; className?: string }> = ({
  isOpen,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${className}`}
    aria-hidden="true"
  >
    <path
      d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
      fill="currentColor"
    />
  </svg>
);

interface AccordionItemProps {
  title: string;
  tagSlot?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  tagSlot,
  children,
  isOpen,
  onClick,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonId = `accordion-button-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const contentId = `accordion-content-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="border-divider-gray-light w-full border-b">
      <button
        className="focus:ring-border-primary flex w-full items-center justify-between px-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset md:px-6 md:py-6"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <Label
          size="l"
          weight="bold"
          className="min-w-0 flex-1 cursor-pointer break-words text-left"
        >
          {title}
        </Label>
        <span className="ml-3 flex flex-shrink-0 items-center gap-2">
          {tagSlot}
          <span className="flex-shrink-0">
            <ChevronIcon isOpen={isOpen} className="text-text-basic" />
          </span>
        </span>
        <span className="sr-only">{isOpen ? "접기" : "펼치기"}</span>
      </button>
      <div
        ref={contentRef}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <Label size="s" className="p-6">
          {children}
        </Label>
      </div>
    </div>
  );
};

interface AccordionProps {
  items: Omit<AccordionItemProps, "isOpen" | "onClick">[];
  defaultOpenIndex?: number | null;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = null,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const handleItemClick = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="border-divider-gray-light overflow-hidden border-t">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          {...item}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};
