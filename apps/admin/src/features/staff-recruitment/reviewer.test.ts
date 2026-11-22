import { describe, expect, it, jest } from "@jest/globals";
import type { StaffReviewerCandidate } from "@core/types/staff-recruitment";
import { filterReviewerCandidates, REVIEWER_STATUS_LABELS, toReviewerExpiry } from "./reviewer";

const candidates: StaffReviewerCandidate[] = [
  {
    user_id: 2099999999,
    user_name: "가상 운영진 A",
    department: "예시학과",
    affiliation: "기획팀",
    has_admin_account: true,
    reviewer_status: null,
  },
  {
    user_id: 2099999998,
    user_name: "가상 운영진 B",
    department: null,
    affiliation: "SW팀",
    has_admin_account: true,
    reviewer_status: "ACTIVE",
  },
];

describe("staff reviewer helpers", () => {
  it("searches candidates by stable id and visible profile fields", () => {
    expect(filterReviewerCandidates(candidates, "2099999998")).toEqual([
      candidates[1],
    ]);
    expect(filterReviewerCandidates(candidates, "기획")).toEqual([
      candidates[0],
    ]);
  });

  it("uses 23:59 Korea time on the selected date and rejects expired dates", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-12-31T14:58:00Z"));
    expect(toReviewerExpiry("")).toBeNull();
    expect(toReviewerExpiry("invalid")).toBeNull();
    expect(toReviewerExpiry("2026-02-31")).toBeNull();
    expect(toReviewerExpiry("2026-12-31")).toBe("2026-12-31T23:59:00+09:00");
    jest.setSystemTime(new Date("2026-12-31T14:59:00Z"));
    expect(toReviewerExpiry("2026-12-31")).toBeNull();
    expect(toReviewerExpiry("2027-01-01")).toBe("2027-01-01T23:59:00+09:00");
    jest.useRealTimers();
  });

  it("keeps explicit labels for every reviewer state", () => {
    expect(REVIEWER_STATUS_LABELS).toEqual({
      ACTIVE: "열람 중",
      REVOKED: "회수됨",
      EXPIRED: "만료됨",
    });
  });
});
