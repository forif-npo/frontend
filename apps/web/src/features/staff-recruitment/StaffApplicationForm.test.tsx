/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { StaffApplicationDetail, StaffRecruitmentRound } from "@core/types/staff-recruitment";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("./api", () => ({
  submitStaffApplication: jest.fn(),
  updateStaffApplication: jest.fn(),
  cancelStaffApplication: jest.fn(),
}));
jest.mock("ky", () => ({ HTTPError: class HTTPError extends Error {} }));
jest.mock("@core/utils/private-file-download", () => ({
  downloadPrivateFile: jest.fn(),
}));
jest.mock("@/components/ActionConfirmModal", () => ({
  ActionConfirmModal: ({
    isOpen,
    action,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    action: string;
    onClose: () => void;
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label={`${action} 확인`}>
        <button onClick={onClose}>닫기</button>
        <button onClick={onConfirm}>{action} 확정</button>
      </div>
    ) : null,
}));

import {
  cancelStaffApplication,
  submitStaffApplication,
  updateStaffApplication,
} from "./api";
import { StaffApplicationForm } from "./StaffApplicationForm";

const recruitment = {
  recruitment_id: 7,
  departments: [
    {
      department_id: 3,
      name: "예시팀",
      description: null,
      display_order: 1,
      active: true,
    },
  ],
  questions: [
    {
      question_id: 1,
      label: "첫 문항",
      type: "SHORT_TEXT",
      required: false,
      max_length: 100,
      display_order: 1,
    },
    {
      question_id: 2,
      label: "둘째 문항",
      type: "LONG_TEXT",
      required: false,
      max_length: 100,
      display_order: 2,
    },
    {
      question_id: 3,
      label: "첨부 파일",
      type: "FILE",
      required: true,
      max_length: 0,
      display_order: 3,
    },
    {
      question_id: 4,
      label: "참고 링크",
      type: "LINK",
      required: true,
      max_length: 200,
      display_order: 4,
    },
  ],
} as StaffRecruitmentRound;

const application: StaffApplicationDetail = {
  application_id: 42,
  recruitment_id: 7,
  applicant_user_id: 1,
  applicant_name: "테스트 지원자",
  applicant_department: "정보시스템학과",
  applicant_email: "test@example.com",
  applicant_phone_num: null,
  applied_departments: [{ department_id: 3, name: "예시팀", priority: 1 }],
  status: "SUBMITTED",
  submitted_at: "2026-11-17T12:00:00+09:00",
  can_modify: true,
  interview_slots: [],
  answers: [
    {
      question_id: 1,
      question_label: "첫 문항",
      question_type: "SHORT_TEXT",
      answer: "원래 답변",
    },
    {
      question_id: 2,
      question_label: "둘째 문항",
      question_type: "LONG_TEXT",
      answer: "",
    },
    {
      question_id: 3,
      question_label: "첨부 파일",
      question_type: "FILE",
      answer: "portfolio.pdf",
    },
    {
      question_id: 4,
      question_label: "참고 링크",
      question_type: "LINK",
      answer: "https://example.com",
    },
  ],
};

describe("StaffApplicationForm", () => {
  beforeEach(() => {
    jest.mocked(submitStaffApplication).mockReset();
    jest.mocked(updateStaffApplication).mockReset();
    jest.mocked(cancelStaffApplication).mockReset();
  });
  it("uses the shared file field and submits a selected file with a valid link", async () => {
    const file = new File(["portfolio"], "example.pdf", {
      type: "application/pdf",
    });
    const onSubmitted = jest.fn();
    jest.mocked(submitStaffApplication).mockResolvedValue({
      application_id: 42,
      recruitment_id: 7,
      status: "SUBMITTED",
      submitted_at: "2026-11-17T12:00:00+09:00",
    });
    render(
      <StaffApplicationForm
        recruitment={recruitment} interviewPlan={null}
        onSubmitted={onSubmitted}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "1지망" }));
    fireEvent.click(screen.getByRole("option", { name: "예시팀" }));
    fireEvent.drop(screen.getByRole("button", { name: "3. 첨부 파일" }), {
      dataTransfer: { files: [file] },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /4. 참고 링크/ }), {
      target: { value: "https://example.com/portfolio" },
    });
    const submitButton = screen.getByRole("button", {
      name: "지원서 제출",
    }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    fireEvent.click(
      screen.getByRole("button", {
        name: "작성하신 개인정보와 답변은 운영 기록을 위해 FORIF DB에 보관됨을 확인하였습니다.",
      }),
    );
    expect(submitButton.disabled).toBe(false);
    fireEvent.click(submitButton);

    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(submitStaffApplication).toHaveBeenCalledWith(
      7,
      {
        department_choices: [{ department_id: 3, priority: 1 }],
        answers: [
          { question_id: 1, answer: "" },
          { question_id: 2, answer: "" },
          { question_id: 3, answer: "" },
          { question_id: 4, answer: "https://example.com/portfolio" },
        ],
        interview_slots: [],
      },
      { 3: file },
    );
  });

  it("prefills the existing answers and retains the attachment when editing", async () => {
    const onUpdated = jest.fn();
    jest.mocked(updateStaffApplication).mockResolvedValue(application);
    render(
      <StaffApplicationForm
        recruitment={recruitment} interviewPlan={null}
        initialApplication={application}
        onUpdated={onUpdated}
      />,
    );

    expect(
      (screen.getByRole("textbox", { name: /1. 첫 문항/ }) as HTMLInputElement)
        .value,
    ).toBe("원래 답변");
    expect(screen.getByText("portfolio.pdf")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: /1. 첫 문항/ }), {
      target: { value: "수정한 답변" },
    });
    fireEvent.click(screen.getByRole("button", { name: "수정" }));
    expect(updateStaffApplication).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "수정 확정" }));

    await waitFor(() => expect(onUpdated).toHaveBeenCalledTimes(1));
    expect(updateStaffApplication).toHaveBeenCalledWith(
      7,
      {
        department_choices: [{ department_id: 3, priority: 1 }],
        answers: [
          { question_id: 1, answer: "수정한 답변" },
          { question_id: 2, answer: "" },
          { question_id: 3, answer: "" },
          { question_id: 4, answer: "https://example.com" },
        ],
        interview_slots: [],
        removed_file_question_ids: [],
      },
      {},
    );
  });

  it("cancels only after confirmation", async () => {
    const onCancelled = jest.fn();
    jest.mocked(cancelStaffApplication).mockResolvedValue(undefined);
    render(
      <StaffApplicationForm
        recruitment={recruitment} interviewPlan={null}
        initialApplication={application}
        onCancelled={onCancelled}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "신청 취소" }));
    expect(cancelStaffApplication).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "취소 확정" }));

    await waitFor(() => expect(onCancelled).toHaveBeenCalledTimes(1));
    expect(cancelStaffApplication).toHaveBeenCalledWith(7);
  });

  it("disables editing for an ineligible applicant while keeping cancellation available", () => {
    render(
      <StaffApplicationForm
        recruitment={recruitment} interviewPlan={null}
        initialApplication={{ ...application, can_modify: false }}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: /1. 첫 문항/ }), {
      target: { value: "수정한 답변" },
    });
    expect(
      (screen.getByRole("button", { name: "수정" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "신청 취소" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });
});
