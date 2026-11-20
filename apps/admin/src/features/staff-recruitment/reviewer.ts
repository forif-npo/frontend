import type {
  StaffReviewerCandidate,
  StaffReviewerStatus,
} from "@core/types/staff-recruitment";

export const REVIEWER_STATUS_LABELS: Record<StaffReviewerStatus, string> = {
  ACTIVE: "열람 중",
  REVOKED: "회수됨",
  EXPIRED: "만료됨",
};

export function filterReviewerCandidates(
  candidates: StaffReviewerCandidate[],
  query: string,
) {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  if (!normalized) return candidates;
  return candidates.filter((candidate) =>
    [
      candidate.user_name,
      String(candidate.user_id),
      candidate.department ?? "",
      candidate.affiliation,
    ].some((value) => value.toLocaleLowerCase("ko-KR").includes(normalized)),
  );
}

export function toReviewerExpiry(value: string): string | null {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
    return null;
  }
  return date.toISOString();
}
