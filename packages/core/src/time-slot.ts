/**
 * 날짜 × 시간 범위를 일정 길이로 나눈 시간표 계산.
 *
 * 면접 가능 시간처럼 "여러 날짜 중 되는 시간을 고르는" 화면이 공통으로 쓴다.
 * 특정 기능의 용어를 알지 않도록 날짜 목록·시간 범위·칸 길이만 받는다.
 */

const MINUTES_PER_HOUR = 60;

export interface TimeSlotRange {
  /** 첫 칸의 시작 시각(시). 포함한다. */
  startHour: number;
  /** 마지막 칸의 끝 시각(시). 이 시각에 시작하는 칸은 없다. */
  endHour: number;
  /** 한 칸의 길이(분). */
  slotMinutes: number;
}

/** 시간표 한 칸을 가리키는 키. 문자열 정렬이 날짜·시각 순이 되도록 분을 네 자리로 맞춘다. */
export function timeSlotKey(date: string, startMinute: number): string {
  return `${date}T${String(startMinute).padStart(4, "0")}`;
}

export function parseTimeSlotKey(key: string): {
  date: string;
  startMinute: number;
} {
  const [date, minute] = key.split("T");
  return { date: date ?? "", startMinute: Number(minute ?? 0) };
}

/**
 * 시간 범위를 칸 길이로 나눈 시작 시각 목록(자정부터의 분).
 * 9~22시를 30분으로 나누면 09:00부터 21:30까지 26개다.
 */
export function timeSlotStarts(range: TimeSlotRange): number[] {
  const first = range.startHour * MINUTES_PER_HOUR;
  const last = range.endHour * MINUTES_PER_HOUR;
  const step = range.slotMinutes > 0 ? range.slotMinutes : MINUTES_PER_HOUR;

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

/** 시각 라벨. 정각은 "오전 9시", 그 밖은 "오전 9:30" 형태로 쓴다. */
export function formatSlotTime(startMinute: number): string {
  const hour = Math.floor(startMinute / MINUTES_PER_HOUR);
  const minute = startMinute % MINUTES_PER_HOUR;
  const meridiem = hour < 12 || hour === 24 ? "오전" : "오후";
  const display = hour % 12 === 0 ? 12 : hour % 12;

  return minute === 0
    ? `${meridiem} ${display}시`
    : `${meridiem} ${display}:${String(minute).padStart(2, "0")}`;
}

/**
 * 한 칸의 시작~끝 표기. 끝 시각은 시작 + 칸 길이다.
 * "오후 5:30 - 6:00", "오후 4:20 - 4:40"처럼 쓰고, 오전·오후가 바뀔 때만 끝에도 붙인다.
 */
export function formatSlotRange(startMinute: number, slotMinutes: number): string {
  const end = startMinute + slotMinutes;
  const clock = (minute: number) => {
    const hour = Math.floor(minute / MINUTES_PER_HOUR) % 24;
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${display}:${String(minute % MINUTES_PER_HOUR).padStart(2, "0")}`;
  };
  const meridiem = (minute: number) =>
    Math.floor(minute / MINUTES_PER_HOUR) % 24 < 12 ? "오전" : "오후";

  const startLabel = `${meridiem(startMinute)} ${clock(startMinute)}`;
  const endLabel =
    meridiem(end) === meridiem(startMinute)
      ? clock(end)
      : `${meridiem(end)} ${clock(end)}`;
  return `${startLabel} - ${endLabel}`;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 시간표 머리글. "12/1" 과 요일 두 줄로 쓴다. */
export function formatSlotDate(date: string): {
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
export function timeSlotsInRange(
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
      keys.push(timeSlotKey(date, minute));
    }
  }
  return keys;
}

/**
 * 시작일부터 종료일까지 하루씩 날짜 목록을 만든다. 둘 다 포함한다.
 * 날짜 형식이 아니거나 시작이 종료보다 늦으면 빈 목록이다.
 *
 * 시간대에 따라 하루가 밀리지 않도록 UTC 정오 기준으로 더한다.
 */
export function datesInRange(start: string, end: string): string[] {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(start) || !pattern.test(end) || start > end) {
    return [];
  }

  const dates: string[] = [];
  const cursor = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (cursor.getTime() <= last.getTime()) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

/** `<input type="time">` 값("HH:MM")을 자정부터의 분으로 바꾼다. 형식이 틀리면 null이다. */
export function clockTimeToMinute(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? hour * MINUTES_PER_HOUR + minute : null;
}

/** 자정부터의 분을 `<input type="time">` 값("HH:MM")으로 바꾼다. */
export function minuteToClockTime(startMinute: number): string {
  const hour = Math.floor(startMinute / MINUTES_PER_HOUR);
  const minute = startMinute % MINUTES_PER_HOUR;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
