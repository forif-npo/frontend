import type { AdminStudyDetail } from "../api";

const WEEKDAY_LABELS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

export function splitPlanContent(content: string | null) {
  const contents = content
    ?.split("; ")
    .map((item) => item.trim())
    .filter(Boolean);

  return contents && contents.length > 0 ? contents : ["-"];
}

export function getSafeExternalUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function formatStudyTime(detail: AdminStudyDetail) {
  const weekDay =
    detail.week_day === null || detail.week_day === undefined
      ? ""
      : (WEEKDAY_LABELS[detail.week_day] ?? "");
  const times = [detail.start_time, detail.end_time]
    .filter(Boolean)
    .join(" ~ ");

  return [weekDay, times].filter(Boolean).join(" ") || "-";
}

export function formatLocation(detail: AdminStudyDetail) {
  if (detail.is_online) return "온라인";

  return (
    [detail.location, detail.location_detail].filter(Boolean).join(" ") || "-"
  );
}

export function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : "-";
}

export function formatDateTime(value?: string | null) {
  if (!value) return "일정 미정";

  return value.replace("T", " ").slice(0, 16);
}
