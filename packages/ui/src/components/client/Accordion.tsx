"use client";
import React, { useId, useRef, useState } from "react";
import { ChevronDown } from "@repo/assets/icons/lucide";
import { Label } from "../server/Label";

interface AccordionItemProps {
  title: string;
  leadingSlot?: React.ReactNode;
  tagSlot?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  leadingSlot,
  tagSlot,
  children,
  contentClassName,
  isOpen,
  onClick,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const accordionId = useId();
  const buttonId = `accordion-button-${accordionId}`;
  const contentId = `accordion-content-${accordionId}`;

  return (
    <div className="border-divider-gray-light w-full border-b">
      <button
        id={buttonId}
        className="focus:ring-border-primary flex w-full items-center justify-between px-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset md:px-6 md:py-6"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <div className="flex min-w-0 flex-1 items-center gap-[14px]">
          {leadingSlot}
          <Label
            size="l"
            weight="bold"
            className="min-w-0 flex-1 cursor-pointer break-words text-left"
          >
            {title}
          </Label>
        </div>
        <span className="ml-3 flex flex-shrink-0 items-center gap-2">
          {tagSlot}
          <span className="flex-shrink-0">
            <ChevronDown
              size={24}
              className={`text-text-basic transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
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
        <div className={contentClassName ?? "p-6"}>{children}</div>
      </div>
    </div>
  );
};

interface AccordionProps {
  items: Omit<AccordionItemProps, "isOpen" | "onClick">[];
  defaultOpenIndex?: number | null;
  contentClassName?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = null,
  contentClassName,
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
          contentClassName={contentClassName}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};
