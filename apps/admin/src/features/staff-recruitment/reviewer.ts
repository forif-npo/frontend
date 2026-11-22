import type { StaffReviewerCandidate, StaffReviewerStatus } from "@core/types/staff-recruitment";

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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const expiresAt = `${value}T23:59:00+09:00`;
  const date = new Date(expiresAt);
  if (
    Number.isNaN(date.getTime()) ||
    new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10) !== value ||
    date.getTime() <= Date.now()
  ) {
    return null;
  }
  return expiresAt;
}
