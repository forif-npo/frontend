import type { StaffInterviewSlot } from "./types/staff-recruitment";
import { formatSlotDate, formatSlotTime } from "./time-slot";

export function staffRecruitmentStorageTitle(
  actYear: number,
  actSemester: number,
): string {
  return `${actYear}-${actSemester}`;
}

export function formatStaffRecruitmentTitle(
  actYear: number,
  actSemester: number,
): string {
  return `${actYear}년 ${actSemester}학기 운영진 모집`;
}

export function formatStaffRecruitmentDepartment(name: string): string {
  return name.endsWith("팀") ? name : `${name}팀`;
}

export function formatStaffInterviewAvailability(
  slots: StaffInterviewSlot[],
  slotMinutes: number | null,
): Array<{ date: string; dateLabel: string; timeLabel: string }> {
  const slotsByDate = new Map<string, number[]>();
  [...slots]
    .sort(
      (first, second) =>
        first.date.localeCompare(second.date) ||
        first.start_minute - second.start_minute,
    )
    .forEach(({ date, start_minute }) => {
      const minutes = slotsByDate.get(date) ?? [];
      minutes.push(start_minute);
      slotsByDate.set(date, minutes);
    });

  return Array.from(slotsByDate, ([date, minutes]) => {
    const label = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(`${date}T12:00:00`));
    const dateLabel = `${label}(${formatSlotDate(date).weekday})`;
    if (!slotMinutes) {
      return {
        date,
        dateLabel,
        timeLabel: minutes.map(formatSlotTime).join(", "),
      };
    }

    const ranges: string[] = [];
    let start = minutes[0];
    let last = start;
    for (const minute of minutes.slice(1)) {
      if (minute === last + slotMinutes) {
        last = minute;
        continue;
      }
      ranges.push(
        start === last
          ? formatSlotTime(start)
          : `${formatSlotTime(start)} ~ ${formatSlotTime(last + slotMinutes)}`,
      );
      start = minute;
      last = minute;
    }
    ranges.push(
      start === last
        ? formatSlotTime(start)
        : `${formatSlotTime(start)} ~ ${formatSlotTime(last + slotMinutes)}`,
    );
    return { date, dateLabel, timeLabel: ranges.join(", ") };
  });
}
