/** @jest-environment jsdom */
import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { Participant } from "@core/types/hackathon";
import { ParticipantsTab } from "./tabs";

const participants: Participant[] = [
  {
    participant_id: 1,
    hackathon_id: 1,
    user_id: 2026000002,
    user_name: "홍길동",
    status: "REGISTERED",
    registered_at: "2026-09-02T00:00:00",
    studies: [],
  },
  {
    participant_id: 2,
    hackathon_id: 1,
    user_id: 2026000001,
    user_name: "김포리프",
    status: "REGISTERED",
    registered_at: "2026-09-01T00:00:00",
    studies: [],
  },
];

describe("해커톤 상세 탭 정렬", () => {
  it("헤더를 클릭하면 참가자 목록을 해당 열 기준으로 정렬한다", () => {
    render(<ParticipantsTab participants={participants} />);

    fireEvent.click(screen.getByRole("button", { name: "이름" }));

    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows[1].textContent).toContain("김포리프");
    expect(rows[2].textContent).toContain("홍길동");
  });
});
