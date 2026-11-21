import type {
  StaffInterviewPlan,
  StaffInterviewSlot,
} from "./types/staff-recruitment";

const MINUTES_PER_HOUR = 60;

/** 시간표 한 칸을 가리키는 키. 문자열 정렬이 날짜·시각 순이 되도록 분을 네 자리로 맞춘다. */
export function interviewSlotKey(date: string, startMinute: number): string {
  return `${date}T${String(startMinute).padStart(4, "0")}`;
}

export function parseInterviewSlotKey(key: string): StaffInterviewSlot {
  const [date, minute] = key.split("T");
  return { date: date ?? "", start_minute: Number(minute ?? 0) };
}

/**
 * 수집 범위를 칸 길이로 나눈 시작 시각 목록(자정부터의 분).
 * 9~22시를 30분으로 나누면 09:00부터 21:30까지 26개다.
 */
export function interviewSlotStarts(plan: StaffInterviewPlan): number[] {
  const first = plan.start_hour * MINUTES_PER_HOUR;
  const last = plan.end_hour * MINUTES_PER_HOUR;
  const step = plan.slot_minutes > 0 ? plan.slot_minutes : MINUTES_PER_HOUR;

  const starts: number[] = [];
  for (let minute = first; minute < last; minute += step) {
    starts.push(minute);
  }
  return starts;
}

/** 정각인 칸인지. 시간표 눈금을 정각에만 붙이는 데 쓴다. */
export function isHourStart(startMinute: number): boolean {
  return startMinute % MINUTES_PER_HOUR === 0;
}

/** 시간표 눈금 라벨. 정각은 "오전 9시", 그 밖은 "9:30" 형태로 쓴다. */
export function formatInterviewTime(startMinute: number): string {
  const hour = Math.floor(startMinute / MINUTES_PER_HOUR);
  const minute = startMinute % MINUTES_PER_HOUR;
  const meridiem = hour < 12 ? "오전" : "오후";
  const display = hour % 12 === 0 ? 12 : hour % 12;

  return minute === 0
    ? `${meridiem} ${display}시`
    : `${meridiem} ${display}:${String(minute).padStart(2, "0")}`;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 시간표 머리글. "12/1" 과 요일 두 줄로 쓴다. */
export function formatInterviewDate(date: string): {
  label: string;
  weekday: string;
} {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { label: date, weekday: "" };
  }
  return {
    label: `${parsed.getMonth() + 1}/${parsed.getDate()}`,
    weekday: WEEKDAYS[parsed.getDay()] ?? "",
  };
}

/**
 * 드래그로 지나간 사각 영역의 칸 키를 만든다.
 * 시작 칸과 끝 칸의 날짜·시각 인덱스 사이를 모두 채운다.
 */
export function interviewSlotsInRange(
  dates: string[],
  starts: number[],
  from: { dateIndex: number; slotIndex: number },
  to: { dateIndex: number; slotIndex: number },
): string[] {
  const dateStart = Math.min(from.dateIndex, to.dateIndex);
  const dateEnd = Math.max(from.dateIndex, to.dateIndex);
  const slotStart = Math.min(from.slotIndex, to.slotIndex);
  const slotEnd = Math.max(from.slotIndex, to.slotIndex);

  const keys: string[] = [];
  for (let dateIndex = dateStart; dateIndex <= dateEnd; dateIndex += 1) {
    const date = dates[dateIndex];
    if (date === undefined) {
      continue;
    }
    for (let slotIndex = slotStart; slotIndex <= slotEnd; slotIndex += 1) {
      const minute = starts[slotIndex];
      if (minute === undefined) {
        continue;
      }
      keys.push(interviewSlotKey(date, minute));
    }
  }
  return keys;
}

/** 선택 상태를 제출용 배열로 바꾼다. 날짜·시각 순으로 정렬해 보낸다. */
export function toInterviewSlotRequest(
  selected: ReadonlySet<string>,
): StaffInterviewSlot[] {
  return Array.from(selected)
    .sort()
    .map(parseInterviewSlotKey)
    .filter((slot) => slot.date !== "");
}

/** 서버가 준 선택을 화면 상태로 되돌린다. */
export function toInterviewSlotKeys(
  slots: readonly StaffInterviewSlot[],
): Set<string> {
  return new Set(
    slots.map((slot) => interviewSlotKey(slot.date, slot.start_minute)),
  );
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
