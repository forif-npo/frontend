"use client";
import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import Image from "next/image";
import { useState } from "react";
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
    setCurrentIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1,
    );
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between">
        <CarouselArrow align="left" title="이전" onClick={handlePrev} />
        <div className="flex w-full max-w-[1200px] flex-row items-center justify-between">
          <div className="max-w-[600px]">
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
            className="rounded-2 hidden md:block"
          />
        </div>
        <CarouselArrow align="right" title="다음" onClick={handleNext} />
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
}: {
  onClick?: () => void;
  title?: string;
  align?: "left" | "right";
}) {
  return (
    <button
      onClick={onClick}
      className="bg-surface-white hover:bg-surface-white-subtler border-border-gray-light hidden cursor-pointer items-center gap-2 rounded-full border p-2 md:flex"
    >
      {align === "left" ? (
        <ArrowLeft className="text-text-basic" />
      ) : (
        <ArrowRight className="text-text-basic" />
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
    <div className="flex items-center gap-2">
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
