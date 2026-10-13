import { describe, expect, it, jest } from "@jest/globals";
import type { StaffReviewerCandidate } from "@core/types/staff-recruitment";
import {
  filterReviewerCandidates,
  REVIEWER_STATUS_LABELS,
  toReviewerExpiry,
} from "./reviewer";

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

  it("rejects an empty, invalid, or past expiry", () => {
    jest.useFakeTimers().setSystemTime(new Date("2027-01-01T00:00:00Z"));
    expect(toReviewerExpiry("")).toBeNull();
    expect(toReviewerExpiry("invalid")).toBeNull();
    expect(toReviewerExpiry("2026-12-31T23:59")).toBeNull();
    expect(toReviewerExpiry("2027-01-02T09:00")).toBe(
      new Date("2027-01-02T09:00").toISOString(),
    );
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
