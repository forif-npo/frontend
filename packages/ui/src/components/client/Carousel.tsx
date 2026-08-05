"use client";
import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import Image from "next/image";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Body } from "../server/Body";
import { Display } from "../server/Display";
import { Button } from "./Button";

interface CarouselProps {
  carouselItems: CarouselItem[];
}
export interface CarouselItem {
  imageSrc: string;
  title: React.ReactNode;
  description: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export function Carousel({ carouselItems }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (carouselItems.length === 0) {
    return <div className="text-center">No items to display</div>;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(carouselItems.length - 1, prev + 1));
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between">
        <CarouselArrow
          align="left"
          title="이전"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          isHidden={currentIndex === 0}
          className="hidden md:flex"
        />
        <div className="bg-surface-white/85 border-border-gray-light flex w-full max-w-[1200px] flex-col-reverse gap-8 overflow-hidden rounded-[28px] border p-6 shadow-[0_18px_50px_rgba(11,80,208,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between md:gap-0 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
          <div className="max-w-[800px]">
            <Display size="s" className="text-text-basic mb-6">
              {currentItem.title}
            </Display>
            <Body size="l" className="text-text-basic mb-6">
              {currentItem.description}
            </Body>
            {currentItem.footer ? (
              <CarouselFooter>{currentItem.footer}</CarouselFooter>
            ) : (
              <div className="flex flex-row gap-4">
                <Button>자세히 보러가기</Button>
              </div>
            )}
          </div>
          <Image
            src={currentItem.imageSrc}
            alt="Carousel Image"
            width={344}
            height={300}
            className="rounded-2 mx-auto h-auto w-full max-w-[260px] md:hidden"
          />
          <Image
            src={currentItem.imageSrc}
            alt="Carousel Image"
            width={344}
            height={300}
            className="rounded-2 hidden md:block"
          />
        </div>
        <CarouselArrow
          align="right"
          title="다음"
          onClick={handleNext}
          disabled={currentIndex === carouselItems.length - 1}
          isHidden={currentIndex === carouselItems.length - 1}
          className="hidden md:flex"
        />
      </div>
      <CarouselIndicators
        total={carouselItems.length}
        current={currentIndex}
        onSelect={setCurrentIndex}
      />
    </div>
  );
}

export function CarouselArrow({
  onClick,
  title,
  align = "left",
  disabled = false,
  isHidden = false,
  size = 24,
  className,
}: {
  onClick?: () => void;
  title?: string;
  align?: "left" | "right";
  disabled?: boolean;
  isHidden?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isHidden}
      aria-label={title}
      aria-hidden={isHidden || undefined}
      className={cn(
        "border-border-gray-light bg-surface-white hover:bg-surface-white-subtler flex shrink-0 cursor-pointer items-center justify-center rounded-full border p-2 disabled:cursor-not-allowed disabled:opacity-40",
        isHidden && "pointer-events-none invisible",
        className,
      )}
    >
      {align === "left" ? (
        <ArrowLeft className="text-text-basic" size={size} />
      ) : (
        <ArrowRight className="text-text-basic" size={size} />
      )}
      <span className="sr-only">{title}</span>
    </button>
  );
}

export function CarouselFooter({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CarouselIndicators({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-2 rounded-full transition-all ${
            index === current ? "w-8" : "w-2"
          }`}
          style={{
            backgroundColor:
              index === current
                ? "var(--krds-color-primary-60)"
                : "var(--krds-color-gray-20)",
          }}
          aria-label={`슬라이드 ${index + 1}로 이동`}
          aria-current={index === current ? "true" : "false"}
        />
      ))}
    </div>
  );
}
