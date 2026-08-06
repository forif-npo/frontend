"use client";

import { useRef, type TouchEvent } from "react";

type SwipeOptions = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
};

export function useHorizontalSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (!touch) return;

    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;

    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      onSwipeRight();
    } else {
      onSwipeLeft();
    }
  };

  const onTouchCancel = () => {
    touchStart.current = null;
  };

  return { onTouchStart, onTouchEnd, onTouchCancel };
}
