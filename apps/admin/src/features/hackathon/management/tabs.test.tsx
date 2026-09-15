/** @jest-environment jsdom */
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import type { Participant, Team } from "@core/types/hackathon";
import { ParticipantsTab, TeamsTab } from "./tabs";

const participants: Participant[] = [
  {
    participant_id: 1,
    hackathon_id: 9901,
    user_id: 10000000,
    user_name: "테스트 사용자",
    status: "REGISTERED",
    registered_at: "2026-06-10T00:00:00.000Z",
    studies: [
      { study_id: 1, study_name: "자율스터디", role: "MENTEE" },
      { study_id: 2, study_name: "README.md", role: "MENTOR" },
    ],
  },
];

describe("ParticipantsTab", () => {
  it("renders study names as standard text and marks mentors only", () => {
    render(<ParticipantsTab participants={participants} />);

    expect(screen.getByText("자율스터디, README.md(멘토)")).not.toBeNull();
    expect(screen.queryByText("수강")).toBeNull();
    expect(screen.getByText("2026-06-10 00:00")).not.toBeNull();
    expect(
      screen.getByRole("columnheader", { name: "스터디" }).style.width,
    ).toBe("360px");
    expect(
      screen.getByRole("columnheader", { name: "등록일" }).style.width,
    ).toBe("160px");
  });
});

const teams: Team[] = [
  {
    hackathon_team_id: 1,
    hackathon_id: 9901,
    name: "테스트 팀",
    topic: "테스트 주제",
    competition_type: "HACKATHON",
    leader_id: 2,
    leader_name: "팀장 사용자",
    member_count: 3,
    status: "FORMING",
    members: [
      {
        user_id: 3,
        user_name: "나다라",
        role: "MEMBER",
        joined_at: "2026-01-01T00:00:00.000Z",
      },
      {
        user_id: 2,
        user_name: "팀장 사용자",
        role: "LEADER",
        joined_at: "2026-01-01T00:00:00.000Z",
      },
      {
        user_id: 1,
        user_name: "가나다",
        role: "MEMBER",
        joined_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
];

describe("TeamsTab", () => {
  it("renders the leader first and remaining members in Korean alphabetical order", () => {
    render(<TeamsTab teams={teams} onDeleteTeam={() => undefined} />);

    expect(
      screen.getByText("팀장 사용자(팀장), 가나다, 나다라"),
    ).not.toBeNull();
  });
});
