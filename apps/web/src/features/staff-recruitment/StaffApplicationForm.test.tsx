/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("./api", () => ({ submitStaffApplication: jest.fn() }));
jest.mock("ky", () => ({ HTTPError: class HTTPError extends Error {} }));

import { submitStaffApplication } from "./api";
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
    { question_id: 1, label: "첫 문항", type: "SHORT_TEXT", required: false, max_length: 100, display_order: 1 },
    { question_id: 2, label: "둘째 문항", type: "LONG_TEXT", required: false, max_length: 100, display_order: 2 },
    { question_id: 3, label: "첨부 파일", type: "FILE", required: true, max_length: 0, display_order: 3 },
    { question_id: 4, label: "참고 링크", type: "LINK", required: true, max_length: 200, display_order: 4 },
  ],
} as StaffRecruitmentRound;

describe("StaffApplicationForm", () => {
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
    render(<StaffApplicationForm recruitment={recruitment} onSubmitted={onSubmitted} />);

    fireEvent.click(screen.getByRole("button", { name: "1지망" }));
    fireEvent.click(screen.getByRole("option", { name: "예시팀" }));
    fireEvent.drop(screen.getByRole("button", { name: "3. 첨부 파일" }), {
      dataTransfer: { files: [file] },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /4. 참고 링크/ }), {
      target: { value: "https://example.com/portfolio" },
    });
    fireEvent.click(screen.getByRole("button", { name: "지원서 제출" }));

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
      },
      { 3: file },
    );
  });
});
