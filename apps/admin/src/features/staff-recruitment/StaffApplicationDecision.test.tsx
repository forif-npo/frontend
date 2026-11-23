/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { StaffInterviewSheet } from "@core/types/staff-recruitment";

jest.mock("@core/utils/api-client", () => ({ handleApiError: jest.fn() }));
jest.mock("@/components/ui/Toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("./api", () => ({
  getStaffInterviewSheet: jest.fn(),
  changeStaffInterviewStatus: jest.fn(),
}));
jest.mock("./PassDepartmentDialog", () => ({
  usePassDepartmentPicker: () => ({ pick: jest.fn(), dialog: null }),
}));

import { changeStaffInterviewStatus, getStaffInterviewSheet } from "./api";
import { StaffApplicationDecision } from "./StaffApplicationDecision";

const sheet: StaffInterviewSheet = {
  application_id: 1,
  applicant_name: "지원자",
  status: "BEFORE",
  assigned_slot: null,
  slot_minutes: 30,
  common_questions: [],
  first_department: null,
  second_department: null,
  extra_questions: [],
  passed_department: null,
  results_finalized: false,
};

describe("StaffApplicationDecision", () => {
  const results: Array<["PASSED" | "FAILED", string]> = [
    ["PASSED", "합격"],
    ["FAILED", "불합격"],
  ];

  it("keeps both footer fields visible before an interview is assigned", async () => {
    jest.mocked(getStaffInterviewSheet).mockResolvedValueOnce(sheet);

    render(<StaffApplicationDecision recruitmentId={2} applicationId={1} canDecide={false} />);

    await waitFor(() => expect(getStaffInterviewSheet).toHaveBeenCalledWith(2, 1));
    expect(screen.getByText("면접 배정시각").nextSibling?.textContent).toBe("-");
    expect(screen.getByText("면접 결과").nextSibling?.textContent).toBe("-");
    expect(screen.queryByRole("button", { name: "합격" })).toBeNull();
  });

  it.each(results)("shows assigned time and %s as %s", async (status, label) => {
      jest.mocked(getStaffInterviewSheet).mockResolvedValueOnce({
        ...sheet,
        status,
        assigned_slot: { date: "2026-11-26", start_minute: 960 },
      });

      render(<StaffApplicationDecision recruitmentId={2} applicationId={1} canDecide />);

      expect(await screen.findByText("11/26(목) 오후 4:00 - 4:30")).not.toBeNull();
      expect(screen.getByText("면접 결과").nextSibling?.textContent).toBe(label);
  });

  it("updates the text after an interview result is saved", async () => {
    jest.mocked(getStaffInterviewSheet).mockResolvedValueOnce(sheet);
    jest.mocked(changeStaffInterviewStatus).mockResolvedValueOnce({ ...sheet, status: "FAILED" });

    render(<StaffApplicationDecision recruitmentId={2} applicationId={1} canDecide />);

    fireEvent.click(await screen.findByRole("button", { name: "불합격" }));
    await waitFor(() =>
      expect(screen.getByText("면접 결과").nextSibling?.textContent).toBe("불합격"),
    );
  });
});
