/** @jest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { MyStaffApplicationSummary } from "@core/types/staff-recruitment";

jest.mock("./MyStaffApplicationView", () => ({
  MyStaffApplicationView: ({ recruitmentId }: { recruitmentId: number }) => (
    <div>지원서 {recruitmentId}</div>
  ),
}));

import { StaffApplicationManageSection } from "./StaffApplicationManageSection";

const applications: MyStaffApplicationSummary[] = [
  {
    application_id: 2,
    recruitment_id: 12,
    act_year: 2027,
    act_semester: 1,
    status: "SUBMITTED",
    submitted_at: "2026-11-17T12:00:00+09:00",
  },
  {
    application_id: 1,
    recruitment_id: 8,
    act_year: 2026,
    act_semester: 2,
    status: "SUBMITTED",
    submitted_at: "2026-06-17T12:00:00+09:00",
  },
];

describe("StaffApplicationManageSection", () => {
  it("has one tab and opens the selected recruitment's existing application view", () => {
    render(<StaffApplicationManageSection applications={applications} />);

    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(screen.getByRole("tab", { name: /지원 내역/ })).toBeTruthy();
    expect(screen.getByText("지원서 12")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "2026년 2학기 운영진 모집" }),
    );
    expect(screen.getByText("지원서 8")).toBeTruthy();
  });

  it("opens the requested recruitment from the completion page", () => {
    render(
      <StaffApplicationManageSection
        applications={applications}
        targetRecruitmentId={8}
      />,
    );

    expect(screen.getByText("지원서 8")).toBeTruthy();
  });
});
