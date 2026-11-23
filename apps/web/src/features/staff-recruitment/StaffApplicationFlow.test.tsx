/** @jest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { StaffApplicationDetail, StaffApplicationSubmitResponse, StaffRecruitmentRound } from "@core/types/staff-recruitment";

const push = jest.fn();
const replace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));
jest.mock("./api", () => ({ getMyStaffApplication: jest.fn() }));
jest.mock("./application-error", () => ({
  getStaffApplicationErrorInfo: jest.fn(),
}));
jest.mock("./DuplicateStaffApplicationModal", () => ({
  DuplicateStaffApplicationModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label="이미 제출한 지원서">
        <button type="button" onClick={onClose}>
          마이페이지에서 확인
        </button>
      </div>
    ) : null,
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

import { getMyStaffApplication } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";
import { StaffApplicationFlow } from "./StaffApplicationFlow";

const recruitment = {
  recruitment_id: 7,
  act_year: 2027,
  act_semester: 1,
} as StaffRecruitmentRound;

describe("StaffApplicationFlow", () => {
  beforeEach(() => {
    push.mockClear();
    replace.mockClear();
    jest.mocked(getMyStaffApplication).mockReset();
    jest.mocked(getStaffApplicationErrorInfo).mockReset();
  });

  it("shows the completion page after submission and opens its application in My Page", async () => {
    jest
      .mocked(getMyStaffApplication)
      .mockRejectedValue(new Error("not found"));
    jest.mocked(getStaffApplicationErrorInfo).mockResolvedValue({
      code: "FOR155-404",
      message: "제출한 지원서를 찾을 수 없습니다.",
    });
    window.scrollTo = jest.fn();
    render(
      <StaffApplicationFlow recruitment={recruitment} interviewPlan={null} />,
    );

    await screen.findByRole("button", { name: "지원서 제출" });
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

  it("blocks a direct link to the form when an application already exists", async () => {
    jest
      .mocked(getMyStaffApplication)
      .mockResolvedValue({} as StaffApplicationDetail);

    render(
      <StaffApplicationFlow recruitment={recruitment} interviewPlan={null} />,
    );

    const dialog = await screen.findByRole("dialog", {
      name: "이미 제출한 지원서",
    });
    expect(screen.queryByRole("button", { name: "지원서 제출" })).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "마이페이지에서 확인" }),
    );
    expect(dialog).toBeTruthy();
    expect(replace).toHaveBeenCalledWith(
      "/my?section=staff-applications&recruitment_id=7",
    );
  });
});
