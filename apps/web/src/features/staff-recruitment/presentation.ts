import type { StaffRecruitmentApplicationStatus } from "@core/types/staff-recruitment";

export const APPLICATION_STATUS_LABELS: Record<
  StaffRecruitmentApplicationStatus,
  string
> = {
  UPCOMING: "모집 예정",
  OPEN: "지원 접수 중",
  CLOSED: "모집 마감",
  CANCELED: "모집 취소",
};

export function formatRecruitmentPeriod(
  startsAt: string | null,
  endsAt: string | null,
): string {
  if (!startsAt || !endsAt) return "모집 일정 미정";

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formatter.format(new Date(startsAt))} – ${formatter.format(
    new Date(endsAt),
  )}`;
}

export function recruitmentStatusMessage(
  status: StaffRecruitmentApplicationStatus,
  unavailableReason: string | null,
): string {
  if (unavailableReason) return unavailableReason;
  switch (status) {
    case "UPCOMING":
      return "접수 시작 전입니다. 모집 안내와 일정을 미리 확인해주세요.";
    case "OPEN":
      return "현재 지원서를 접수하고 있습니다.";
    case "CANCELED":
      return "이 모집은 운영 사정으로 취소되었습니다.";
    default:
      return "지원 접수가 마감되었습니다.";
  }
}
