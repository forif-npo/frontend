/** @jest-environment jsdom */
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import type { Participant } from "@core/types/hackathon";
import { ParticipantsTab } from "./tabs";

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
    expect(
      screen.getByRole("columnheader", { name: "스터디" }).style.width,
    ).toBe("360px");
  });
});
