import { parseTimeSlotKey, timeSlotKey, timeSlotStarts } from "./time-slot";
import type {
  StaffInterviewPlan,
  StaffInterviewSlot,
} from "./types/staff-recruitment";

const MINUTES_PER_HOUR = 60;

/** 면접 일정의 시간 범위. 시간표 컴포넌트와 계산 함수가 받는 형태로 바꾼다. */
export function interviewSlotRange(plan: StaffInterviewPlan) {
  return {
    startHour: plan.start_hour,
    endHour: plan.end_hour,
    slotMinutes: plan.slot_minutes,
  };
}

/** 면접 일정에서 하루의 칸 시작 시각 목록(자정부터의 분). */
export function interviewSlotStarts(plan: StaffInterviewPlan): number[] {
  return timeSlotStarts(interviewSlotRange(plan));
}

/** 선택 상태를 제출용 배열로 바꾼다. 날짜·시각 순으로 정렬해 보낸다. */
export function toInterviewSlotRequest(
  selected: ReadonlySet<string>,
): StaffInterviewSlot[] {
  return Array.from(selected)
    .sort()
    .map(parseTimeSlotKey)
    .filter((slot) => slot.date !== "")
    .map((slot) => ({ date: slot.date, start_minute: slot.startMinute }));
}

/** 서버가 준 선택을 화면 상태로 되돌린다. */
export function toInterviewSlotKeys(
  slots: readonly StaffInterviewSlot[],
): Set<string> {
  return new Set(slots.map((slot) => timeSlotKey(slot.date, slot.start_minute)));
}

/** 설정 범위 밖으로 밀려난 선택. 회장단이 후보 날짜나 칸 길이를 바꾼 뒤에 생길 수 있다. */
export function outOfRangeSlots(
  plan: StaffInterviewPlan,
  slots: readonly StaffInterviewSlot[],
): StaffInterviewSlot[] {
  const dates = new Set(plan.dates);
  const first = plan.start_hour * MINUTES_PER_HOUR;
  const last = plan.end_hour * MINUTES_PER_HOUR;

  return slots.filter(
    (slot) =>
      !dates.has(slot.date) ||
      slot.start_minute < first ||
      slot.start_minute >= last ||
      (slot.start_minute - first) % plan.slot_minutes !== 0,
  );
}
