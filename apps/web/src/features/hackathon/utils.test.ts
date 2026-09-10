import { describe, expect, it } from "@jest/globals";
import type { Hackathon, TeamMember } from "@core/types/hackathon";
import { getCountdownTarget, getMainStage, getRemainingLabel, sortTeamMembersLeaderFirst } from "./utils";

const hackathon: Hackathon = {
  hackathon_id: 1,
  held_year: 2026,
  held_semester: 1,
  event_round: 1,
  title: "FORIF Hackathon",
  status: "RECRUITING",
  recruit_ends_at: "2026-09-10T12:00:00.000Z",
  starts_at: "2026-09-20T12:00:00.000Z",
  ends_at: "2026-09-21T12:00:00.000Z",
};

describe("hackathon utils", () => {
  it("places the leader first without changing the original member array", () => {
    const members: TeamMember[] = [
      { user_id: 2, user_name: "Member", role: "MEMBER", joined_at: "" },
      { user_id: 1, user_name: "Leader", role: "LEADER", joined_at: "" },
    ];

    expect(
      sortTeamMembersLeaderFirst(members).map(({ user_id }) => user_id),
    ).toEqual([1, 2]);
    expect(members.map(({ user_id }) => user_id)).toEqual([2, 1]);
  });

  it("derives the main stage from the current hackathon", () => {
    expect(getMainStage(null)).toBe("BEFORE_CREATED");
    expect(getMainStage({ ...hackathon, status: "JUDGING" })).toBe("JUDGING");
  });

  it("uses the stage-specific countdown deadline and team-building fallback", () => {
    expect(getCountdownTarget(hackathon, "RECRUITING")).toEqual({
      label: "모집 마감까지",
      date: "2026-09-10T12:00:00.000Z",
    });
    expect(getCountdownTarget(hackathon, "TEAM_BUILDING")).toEqual({
      label: "팀 구성 마감까지",
      date: "2026-09-20T12:00:00.000Z",
    });
    expect(getCountdownTarget(hackathon, "IN_PROGRESS")).toEqual({
      label: "제출 마감까지",
      date: "2026-09-21T12:00:00.000Z",
    });
  });

  it("formats remaining time and clamps elapsed deadlines to zero", () => {
    const from = new Date("2026-09-01T00:00:00.000Z");

    expect(getRemainingLabel(from, new Date("2026-09-02T02:30:00.000Z"))).toBe(
      "1일 2시간",
    );
    expect(getRemainingLabel(from, new Date("2026-08-31T23:59:00.000Z"))).toBe(
      "0시간 0분",
    );
  });
});
