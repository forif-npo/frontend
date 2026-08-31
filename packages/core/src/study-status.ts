import type { RecruitStatus } from "./types/study";

/** 스터디 모집 상태의 기본 표시명이다. */
export const STUDY_RECRUIT_STATUS_LABELS: Record<RecruitStatus, string> = {
  APPLICABLE: "모집중",
  CLOSED: "모집마감",
};

/** 스터디 개설 신청 상태의 기본 표시명이다. */
export type StudyCreationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RE_APPLIED";

export const STUDY_CREATION_STATUS_LABELS: Record<StudyCreationStatus, string> =
  {
    PENDING: "승인 대기",
    APPROVED: "승인",
    REJECTED: "반려",
    RE_APPLIED: "재신청",
  };
