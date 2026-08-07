import type {
  Hackathon,
  HackathonStatus,
  TeamMember,
} from "@core/types/hackathon";

export function sortTeamMembersLeaderFirst(members: TeamMember[]) {
  return [...members].sort(
    (a, b) => Number(a.role !== "LEADER") - Number(b.role !== "LEADER"),
  );
}

export type MainStage =
  | "BEFORE_CREATED"
  | "RECRUITING"
  | "TEAM_BUILDING"
  | "IN_PROGRESS"
  | "JUDGING"
  | "ENDED";

export const statusLabel: Record<HackathonStatus, string> = {
  RECRUITING: "모집중",
  TEAM_BUILDING: "팀 구성",
  IN_PROGRESS: "진행중",
  JUDGING: "심사중",
  ENDED: "종료",
};

export const statusBadgeVariant: Record<
  HackathonStatus,
  "primary" | "success" | "warning" | "danger" | "disabled"
> = {
  RECRUITING: "success",
  TEAM_BUILDING: "primary",
  IN_PROGRESS: "danger",
  JUDGING: "warning",
  ENDED: "disabled",
};

export function getMainStage(hackathon: Hackathon | null): MainStage {
  if (!hackathon) return "BEFORE_CREATED";
  return hackathon.status;
}

export function getCountdownTarget(hackathon: Hackathon, stage: MainStage) {
  if (stage === "RECRUITING" && hackathon.recruit_ends_at) {
    return { label: "모집 마감까지", date: hackathon.recruit_ends_at };
  }
  if (stage === "TEAM_BUILDING") {
    return {
      label: "팀 구성 마감까지",
      date: hackathon.team_building_ends_at ?? hackathon.starts_at,
    };
  }
  if (stage === "IN_PROGRESS") {
    return { label: "제출 마감까지", date: hackathon.ends_at };
  }
  if (stage === "JUDGING") {
    return { label: "심사 진행중", date: hackathon.ends_at };
  }
  return { label: "종료", date: hackathon.ends_at };
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
