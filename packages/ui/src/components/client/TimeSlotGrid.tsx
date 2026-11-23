"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { formatSlotDate, formatSlotTime, isHourStart, timeSlotKey, timeSlotStarts, timeSlotsInRange } from "@repo/core/time-slot";
import { cn } from "@repo/core/utils/cn";
import { Label } from "../server/Label";

type Cell = { dateIndex: number; slotIndex: number };

export interface TimeSlotGridProps {
  /** 가로축. `YYYY-MM-DD` 날짜 목록이며 순서대로 열이 된다. */
  dates: string[];
  /** 첫 칸의 시작 시각(시). */
  startHour: number;
  /** 마지막 칸의 끝 시각(시). 맨 아래 눈금으로만 나타나고 이 시각에 시작하는 칸은 없다. */
  endHour: number;
  /** 한 칸의 길이(분). 10·15·20·30·60처럼 한 시간을 나누어떨어지게 하는 값을 쓴다. */
  slotMinutes: number;
  /** 선택한 칸의 키 집합. 키는 `@repo/core/time-slot`의 `timeSlotKey`로 만든다. */
  value: ReadonlySet<string>;
  onChange: (next: Set<string>) => void;
  disabled?: boolean;
  error?: string;
  /** 표 위의 안내 문구. 기능에 맞는 말로 바꿔 쓴다. */
  description?: ReactNode;
  /** 표 전체의 접근성 이름. */
  ariaLabel?: string;
  /** 격자 부분의 폭. 기본은 모바일 전체 폭, 넓은 화면 절반 폭으로 가운데 둔다. */
  gridClassName?: string;
}

/**
 * 날짜 × 시간 범위를 칸 길이로 나눈 선택 시간표.
 *
 * 끌어서 여러 칸을 한 번에 칠하고, 이미 칠한 칸에서 시작하면 지운다.
 * 날짜 머리글을 누르면 그 날짜를 통째로 켜고 끈다.
 *
 * 같은 날짜의 칸은 위아래로 붙여 하나의 띠로 보이게 하고 날짜 사이는 띄운다.
 * 시간은 이어지는 값이고 날짜는 끊기는 값이라 눈으로도 그렇게 읽혀야 한다.
 *
 * 칸은 버튼이라 키보드로도 하나씩 켜고 끌 수 있고, 상태는 `aria-pressed`로 전달한다.
 */
export function TimeSlotGrid({
  dates,
  startHour,
  endHour,
  slotMinutes,
  value,
  onChange,
  disabled = false,
  error,
  description = "드래그하거나 클릭하여 가능한 시간을 칠해 주세요.",
  ariaLabel = "시간 선택표",
  gridClassName = "w-full sm:w-1/2",
}: TimeSlotGridProps) {
  const starts = useMemo(
    () => timeSlotStarts({ startHour, endHour, slotMinutes }),
    [startHour, endHour, slotMinutes],
  );

  const [dragFrom, setDragFrom] = useState<Cell | null>(null);
  const [dragTo, setDragTo] = useState<Cell | null>(null);
  // 칠하는 중인지 지우는 중인지. 시작 칸의 상태로 정한다.
  const erasingRef = useRef(false);

  const previewKeys = useMemo(() => {
    if (!dragFrom || !dragTo) {
      return null;
    }
    return new Set(timeSlotsInRange(dates, starts, dragFrom, dragTo));
  }, [dragFrom, dragTo, dates, starts]);

  const commit = useCallback(() => {
    if (previewKeys) {
      const next = new Set(value);
      previewKeys.forEach((key) => {
        if (erasingRef.current) {
          next.delete(key);
        } else {
          next.add(key);
        }
      });
      onChange(next);
    }
    setDragFrom(null);
    setDragTo(null);
  }, [previewKeys, value, onChange]);

  // 격자 밖에서 손을 떼도 드래그가 끝나야 한다.
  useEffect(() => {
    if (!dragFrom) {
      return;
    }
    window.addEventListener("pointerup", commit);
    window.addEventListener("pointercancel", commit);
    return () => {
      window.removeEventListener("pointerup", commit);
      window.removeEventListener("pointercancel", commit);
    };
  }, [dragFrom, commit]);

  const isSelected = (key: string) => {
    if (previewKeys?.has(key)) {
      return !erasingRef.current;
    }
    return value.has(key);
  };

  const startDrag = (cell: Cell, key: string) => {
    if (disabled) {
      return;
    }
    erasingRef.current = value.has(key);
    setDragFrom(cell);
    setDragTo(cell);
  };

  const toggleOne = (key: string) => {
    if (disabled) {
      return;
    }
    const next = new Set(value);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    onChange(next);
  };

  /** 날짜 머리글을 누르면 그 날짜를 통째로 켜거나 끈다. */
  const toggleDate = (date: string) => {
    if (disabled) {
      return;
    }
    const keys = starts.map((minute) => timeSlotKey(date, minute));
    const allOn = keys.every((key) => value.has(key));
    const next = new Set(value);
    keys.forEach((key) => (allOn ? next.delete(key) : next.add(key)));
    onChange(next);
  };

  const allKeys = useMemo(
    () => dates.flatMap((date) => starts.map((minute) => timeSlotKey(date, minute))),
    [dates, starts],
  );
  const allSelected = allKeys.length > 0 && allKeys.every((key) => value.has(key));

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label size="s" className="text-text-sub">
          {description}
        </Label>
        <button
          type="button"
          onClick={() => onChange(allSelected ? new Set() : new Set(allKeys))}
          disabled={disabled}
          className="rounded-2 border px-2.5 py-1 text-xs disabled:opacity-50"
        >
          {allSelected ? "전체 해제" : "전체 선택"}
        </button>
      </div>

      <div
        className={cn("mx-auto mt-2 flex shrink-0 gap-1.5 overflow-x-auto overflow-y-hidden pb-1 sm:gap-2", gridClassName)}
        // 드래그 중 텍스트와 이미지가 끌려가지 않도록 한다.
        onDragStart={(event) => event.preventDefault()}
        role="group"
        aria-label={ariaLabel}
      >
        {/* 왼쪽 눈금. 정각에만 라벨을 붙이고 사이 칸은 비워 둔다. */}
        <div className="w-14 shrink-0 pt-7">
          {starts.map((minute) => (
            <div key={minute} className="flex h-5 items-start justify-start pl-1">
              {/* 라벨의 가운데가 정각 선 위에 오도록 반 칸 끌어올린다. */}
              <span className="text-text-sub -translate-y-1/2 whitespace-nowrap text-[11px] leading-none font-semibold">
                {isHourStart(minute) ? formatSlotTime(minute) : ""}
              </span>
            </div>
          ))}
          {/* 마지막 칸의 끝 시각. 띠의 아래 선 위에 올린다. */}
          <div className="flex h-0 items-start justify-start pl-1">
            <span className="text-text-sub -translate-y-1/2 whitespace-nowrap text-[11px] leading-none font-semibold">
              {formatSlotTime(endHour * 60)}
            </span>
          </div>
        </div>

        {dates.map((date, dateIndex) => {
          const { label, weekday } = formatSlotDate(date);
          return (
            <div key={date} className="min-w-20 flex-1">
              <button
                type="button"
                onClick={() => toggleDate(date)}
                disabled={disabled}
                className="text-text-sub mb-1 flex h-6 w-full items-center justify-center whitespace-nowrap text-[11px] font-semibold disabled:opacity-50"
                aria-label={`${label} ${weekday} 전체 선택`}
              >
                {label}({weekday})
              </button>

              {/* 같은 날짜의 칸은 테두리를 공유해 하나의 띠로 보이게 한다. */}
              <div className="border-gray-30 border-x-2 border-b-2">
                {starts.map((minute, slotIndex) => {
                  const key = timeSlotKey(date, minute);
                  const selected = isSelected(key);
                  // 바로 위 칸도 칠해졌을 때만 사이 선을 정각 선과 같은 회색으로 맞춘다.
                  // 아래 칸만 칠했는데 선까지 바뀌면 위 칸까지 칠해진 것처럼 보인다.
                  const previousMinute = starts[slotIndex - 1];
                  const joinedAbove =
                    selected &&
                    previousMinute !== undefined &&
                    isSelected(timeSlotKey(date, previousMinute));
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`${label} ${formatSlotTime(minute)}`}
                      disabled={disabled}
                      onPointerDown={() => startDrag({ dateIndex, slotIndex }, key)}
                      onPointerEnter={() => {
                        if (dragFrom) {
                          setDragTo({ dateIndex, slotIndex });
                        }
                      }}
                      onClick={(event) => {
                        // 포인터로 누른 경우는 pointerup에서 이미 칠해졌다.
                        // 여기서 또 토글하면 두 번 뒤집혀 아무 일도 없던 것처럼 보인다.
                        // 키보드로 누른 click만 detail이 0이라 그것만 처리한다.
                        if (event.detail === 0) {
                          toggleOne(key);
                        }
                      }}
                      className={cn(
                        "block h-5 w-full disabled:opacity-50",
                        isHourStart(minute)
                          ? "border-gray-30 border-t-2"
                          : cn("border-t", joinedAbove ? "border-t-gray-30" : "border-t-gray-10"),
                        selected ? "bg-primary-50 ring-primary-60 ring-1 ring-inset" : "bg-white",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <Label size="s" className="text-text-danger" role="alert">
          {error}
        </Label>
      )}
    </div>
  );
}
