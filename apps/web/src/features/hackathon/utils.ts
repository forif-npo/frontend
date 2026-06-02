import type { Hackathon, HackathonStatus } from "@core/types/hackathon";

export type MainStage =
  | "BEFORE_CREATED"
  | "RECRUITING"
  | "WAITING_START"
  | "ACTIVE"
  | "ENDED";

export const statusLabel: Record<HackathonStatus, string> = {
  RECRUITING: "모집중",
  TEAM_BUILDING: "팀 구성",
  IN_PROGRESS: "진행중",
  JUDGING: "심사중",
  ENDED: "종료",
};

export function getMainStage(
  hackathon: Hackathon | null,
  serverTime?: string,
): MainStage {
  if (!hackathon) return "BEFORE_CREATED";
  if (hackathon.status === "ENDED") return "ENDED";

  const now = serverTime ? new Date(serverTime) : new Date();
  const recruitEndsAt = hackathon.recruit_ends_at
    ? new Date(hackathon.recruit_ends_at)
    : null;
  const startsAt = new Date(hackathon.starts_at);

  if (recruitEndsAt && now < recruitEndsAt) return "RECRUITING";
  if (now < startsAt) return "WAITING_START";
  return "ACTIVE";
}

export function getCountdownTarget(hackathon: Hackathon, stage: MainStage) {
  if (stage === "RECRUITING" && hackathon.recruit_ends_at) {
    return { label: "모집 마감까지", date: hackathon.recruit_ends_at };
  }
  if (stage === "WAITING_START") {
    return { label: "시작까지", date: hackathon.starts_at };
  }
  if (stage === "ACTIVE") {
    return { label: "제출 마감까지", date: hackathon.ends_at };
  }
  return { label: "종료", date: hackathon.ends_at };
}

export function statusBadgeClass(status: HackathonStatus) {
  const base =
    "inline-flex items-center h-6 px-2.5 rounded-full text-xs font-bold";
  switch (status) {
    case "RECRUITING":
      return `${base} bg-[var(--krds-color-success-5,#eaf6ec)] text-[var(--krds-color-success-60,#267337)]`;
    case "IN_PROGRESS":
      return `${base} bg-[var(--krds-color-danger-5)] text-[var(--krds-color-danger-60)]`;
    case "JUDGING":
      return `${base} bg-[var(--krds-color-warning-5)] text-[var(--krds-color-warning-50,#8a5c00)]`;
    case "ENDED":
      return `${base} bg-[var(--krds-color-gray-5)] text-[var(--krds-color-gray-50)]`;
    default:
      return `${base} bg-[var(--krds-color-primary-5)] text-[var(--krds-color-primary-50)]`;
  }
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getRemainingLabel(from: Date, to: Date) {
  const diff = Math.max(to.getTime() - from.getTime(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  if (days > 0) return `${days}일 ${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}
