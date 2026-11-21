/** @jest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { StaffApplicationSubmitResponse, StaffRecruitmentRound } from "@core/types/staff-recruitment";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));
jest.mock("./StaffApplicationForm", () => ({
  StaffApplicationForm: ({
    onSubmitted,
  }: {
    onSubmitted: (
      result: StaffApplicationSubmitResponse,
      departments: { first: string; second: string | null },
    ) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        onSubmitted(
          {
            application_id: 42,
            recruitment_id: 7,
            status: "SUBMITTED",
            submitted_at: "2026-11-17T12:00:00+09:00",
          },
          { first: "기획팀", second: null },
        )
      }
    >
      지원서 제출
    </button>
  ),
}));

import { StaffApplicationFlow } from "./StaffApplicationFlow";

const recruitment = {
  recruitment_id: 7,
  act_year: 2027,
  act_semester: 1,
} as StaffRecruitmentRound;

describe("StaffApplicationFlow", () => {
  it("shows the completion page after submission and opens its application in My Page", () => {
    window.scrollTo = jest.fn();
    render(<StaffApplicationFlow recruitment={recruitment} interviewPlan={null} />);

    fireEvent.click(screen.getByRole("button", { name: "지원서 제출" }));

    expect(
      screen.getByRole("heading", {
        name: /운영진 지원이 완료되었습니다/,
      }),
    ).toBeTruthy();
    expect(screen.getByText("1지망 기획팀")).toBeTruthy();
    expect(screen.getByText("2지망 -")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "지원서 제출" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "지원서 확인" }));
    expect(push).toHaveBeenCalledWith(
      "/my?section=staff-applications&recruitment_id=7",
    );
  });
});
