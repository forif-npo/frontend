import { format } from "date-fns";

/** yyyy-MM-dd → 수료증 표기용 "yyyy.MM.dd." */
export const toDotDate = (isoDate: string) =>
  `${isoDate.replaceAll("-", ".")}.`;

/** yyyy-MM-dd → 발급일 표기용 "yyyy. MM. dd." */
export const toIssueDate = (isoDate: string) =>
  `${isoDate.split("-").join(". ")}.`;

/** date picker 값 ↔ 폼의 yyyy-MM-dd 문자열 변환 */
export const isoToDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`) : undefined;

export const dateToIso = (date: Date | undefined) =>
  date ? format(date, "yyyy-MM-dd") : "";
