"use client";
import { TimeSlotGrid } from "@ui/components/client";
import type { StaffInterviewPlan } from "@core/types/staff-recruitment";

/**
 * 지원서의 면접 가능 시간 시간표.
 *
 * 회장단이 정한 면접 일정을 공용 시간표에 넘기고, 면접에 맞는 안내 문구를 붙인다.
 * 칠하기·지우기·날짜 전체 선택 같은 동작은 `TimeSlotGrid`가 맡는다.
 */
export function InterviewAvailabilityGrid({
  plan,
  value,
  onChange,
  disabled = false,
  error,
}: {
  plan: StaffInterviewPlan;
  value: ReadonlySet<string>;
  onChange: (next: Set<string>) => void;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <TimeSlotGrid
      dates={plan.dates}
      startHour={plan.start_hour}
      endHour={plan.end_hour}
      slotMinutes={plan.slot_minutes}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      description="드래그하거나 클릭하여 면접이 가능한 시간을 칠해 주세요.(다시 클릭하거나 드래그하면 지워집니다.)"
      ariaLabel="면접 가능 시간 선택표"
    />
  );
}
