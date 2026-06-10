import { toDateTimeMs, toInputDateTime } from "@/utils/datetime";
import type { HackathonStatus } from "@core/types/hackathon";
import {
  HACKATHON_STATUS_FLOW,
  type Hackathon,
  type HackathonFormState,
} from "./types";

export const EMPTY_FORM: HackathonFormState = {
  held_year: String(new Date().getFullYear()),
  held_semester: "1",
  event_round: "1",
  title: "",
  description: "",
  location: "",
  recruit_starts_at: "",
  recruit_ends_at: "",
  team_building_starts_at: "",
  team_building_ends_at: "",
  starts_at: "",
  ends_at: "",
  duration_hours: "8",
};

// 상태별 행 액션 노출 규칙
export type RowAction = "manage" | "edit" | "status" | "submissions" | "delete";

export const ACTION_VISIBILITY: Record<
  HackathonStatus,
  Record<RowAction, boolean>
> = {
  RECRUITING: {
    manage: true,
    edit: true,
    status: true,
    submissions: false,
    delete: true,
  },
  TEAM_BUILDING: {
    manage: true,
    edit: true,
    status: true,
    submissions: false,
    delete: true,
  },
  IN_PROGRESS: {
    manage: true,
    edit: true,
    status: true,
    submissions: true,
    delete: false,
  },
  JUDGING: {
    manage: true,
    edit: true,
    status: true,
    submissions: true,
    delete: false,
  },
  ENDED: {
    manage: true,
    edit: true,
    status: true,
    submissions: true,
    delete: true,
  },
};

/** 시작/종료 일시로부터 진행 시간(시간 단위)을 계산한다. */
export function calculateDurationHours(startsAt?: string, endsAt?: string) {
  if (!startsAt || !endsAt) return EMPTY_FORM.duration_hours;

  const startsAtMs = toDateTimeMs(startsAt);
  const endsAtMs = toDateTimeMs(endsAt);
  if (startsAtMs === null || endsAtMs === null || endsAtMs <= startsAtMs) {
    return EMPTY_FORM.duration_hours;
  }

  const hours = (endsAtMs - startsAtMs) / (1000 * 60 * 60);
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

/** 다음 진행 상태를 반환한다. (마지막 상태면 undefined) */
export function getNextStatus(status: HackathonStatus) {
  const index = HACKATHON_STATUS_FLOW.indexOf(status);
  return index >= 0 ? HACKATHON_STATUS_FLOW[index + 1] : undefined;
}

/** 종료되지 않은(진행 중인) 해커톤 여부 */
export function isActiveHackathon(status: HackathonStatus) {
  return status !== "ENDED";
}

/** 발표 자료 파일 URL을 다운로드 URL로 변환한다. (해당 없으면 null) */
export function toPresentationDownloadUrl(fileUrl?: string | null) {
  if (!fileUrl || !fileUrl.includes("/api/v1/files/")) {
    return null;
  }

  try {
    const url = new URL(fileUrl);
    url.searchParams.set("download", "true");
    return url.toString();
  } catch {
    const separator = fileUrl.includes("?") ? "&" : "?";
    return `${fileUrl}${separator}download=true`;
  }
}

/** 해커톤 데이터를 폼 상태로 변환한다. */
export function toFormState(hackathon: Hackathon): HackathonFormState {
  const startsAt = toInputDateTime(hackathon.starts_at);
  const endsAt = toInputDateTime(hackathon.ends_at);

  return {
    held_year: String(hackathon.held_year),
    held_semester: String(hackathon.held_semester),
    event_round: String(hackathon.event_round),
    title: hackathon.title ?? "",
    description: hackathon.description ?? "",
    location: hackathon.location ?? "",
    recruit_starts_at: toInputDateTime(hackathon.recruit_starts_at),
    recruit_ends_at: toInputDateTime(hackathon.recruit_ends_at),
    team_building_starts_at: toInputDateTime(hackathon.team_building_starts_at),
    team_building_ends_at: toInputDateTime(hackathon.team_building_ends_at),
    starts_at: startsAt,
    ends_at: endsAt,
    duration_hours: calculateDurationHours(startsAt, endsAt),
  };
}
