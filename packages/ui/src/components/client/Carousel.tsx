"use client";
import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { cn } from "../../utils/cn";

interface CarouselProps {
  carouselItems: CarouselItem[];
  bannerClassName?: string;
}
export interface CarouselItem {
  id: string;
  content: ReactNode;
  mobileAspect?: "square" | "desktop";
}

export function Carousel({ carouselItems, bannerClassName }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const touchStartX = useRef<number | null>(null);
  const totalItems = carouselItems.length;

  useEffect(() => {
    setCurrentIndex((previousIndex) =>
      totalItems === 0 ? 0 : Math.min(previousIndex, totalItems - 1),
    );

    if (totalItems <= 1) return;

    const timer = window.setInterval(() => {
      setSlideDirection("forward");
      setCurrentIndex((previousIndex) => (previousIndex + 1) % totalItems);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [totalItems]);

  if (totalItems === 0) {
    return <div className="text-center">No items to display</div>;
  }

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setSlideDirection("backward");
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex === totalItems - 1) return;
    setSlideDirection("forward");
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSelect = (index: number) => {
    setSlideDirection(index < currentIndex ? "backward" : "forward");
    setCurrentIndex(index);
  };

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < totalItems - 1;

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX === null || endX === undefined) return;

    const swipeDistance = endX - startX;
    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance > 0) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative w-full">
        <div
          className={cn(
            "mx-auto w-full max-w-[960px] touch-pan-y overflow-hidden rounded-[28px] md:aspect-[4/1]",
            currentItem.mobileAspect === "desktop"
              ? "aspect-[4/1]"
              : "aspect-square",
            bannerClassName,
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            touchStartX.current = null;
          }}
        >
          <div
            key={currentItem.id}
            className={
              slideDirection === "forward"
                ? "animate-banner-slide-forward h-full"
                : "animate-banner-slide-backward h-full"
            }
          >
            {currentItem.content}
          </div>
        </div>
        {hasPrevious && (
          <CarouselArrow
            align="left"
            title="이전 배너"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 bg-white/85 md:flex"
          />
        )}
        {hasNext && (
          <CarouselArrow
            align="right"
            title="다음 배너"
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 bg-white/85 md:flex"
          />
        )}
      </div>
      <CarouselIndicators
        total={totalItems}
        current={currentIndex}
        onSelect={handleSelect}
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

export function CarouselFooter({ children }: { children?: ReactNode }) {
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
