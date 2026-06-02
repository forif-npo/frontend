import { format as dateFnsFormat } from "date-fns";
import { ko } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const KST = "Asia/Seoul";

export function formatDate(
  date: Date | number | string,
  formatStr: string,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const kstDate = toZonedTime(dateObj, KST);
  return dateFnsFormat(kstDate, formatStr, { locale: ko });
}

export function parseToKST(isoString: string): Date {
  return toZonedTime(new Date(isoString), KST);
}
