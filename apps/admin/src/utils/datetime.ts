/**
 * datetime-local input(<input type="datetime-local">)과 백엔드 LocalDateTime
 * 문자열을 다루기 위한 공통 날짜/시간 유틸리티.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/** Date → datetime-local input value (로컬 시간) */
export function toDateTimeInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** ISO 8601 → datetime-local input value (로컬 시간) */
export function toInputDateTime(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return toDateTimeInputValue(date);
}

/**
 * datetime-local input value → 백엔드 LocalDateTime 문자열 (없으면 undefined)
 * 백엔드가 타임존 없는 LocalDateTime을 받으므로 값을 그대로 전달한다.
 */
export function toLocalDateTime(value: string) {
  if (!value) return undefined;
  return value;
}

/** datetime-local input value → epoch milliseconds (유효하지 않으면 null) */
export function toDateTimeMs(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.getTime();
}

/** datetime-local input value에 시간을 더한 datetime-local 값 (유효하지 않으면 undefined) */
export function addHoursToDateTime(value: string, hours: number) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  date.setMinutes(date.getMinutes() + hours * 60);
  return toDateTimeInputValue(date);
}

/** datetime-local 값을 "YYYY. MM. DD HH:MM" 형태의 라벨로 변환 */
export function formatDateTimeLabel(value?: string) {
  if (!value) return "-";
  const [date, time] = value.split("T");
  if (!date || !time) return value;
  return `${date.replaceAll("-", ". ")} ${time}`;
}
