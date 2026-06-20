"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";

interface PresentationControlsProps {
  canPrev: boolean;
  canNext: boolean;
  isFullscreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
}

const buttonClass =
  "flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30";

export function PresentationControls({
  canPrev,
  canNext,
  isFullscreen,
  onPrev,
  onNext,
  onToggleFullscreen,
}: PresentationControlsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="pointer-events-auto flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="이전"
              className={buttonClass}
              disabled={!canPrev}
              onClick={onPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent>이전 (←)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="다음"
              className={buttonClass}
              disabled={!canNext}
              onClick={onNext}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent>다음 (→ / Space)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={isFullscreen ? "전체화면 종료" : "전체화면"}
              className={buttonClass}
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="h-6 w-6" />
              ) : (
                <Maximize className="h-6 w-6" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>전체화면 (F)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
