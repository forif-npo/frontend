/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/components/page-header", () => ({
  PageHeader: () => null,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: ReactNode }) => <>{children}</>,
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: ComponentProps<"label">) => (
    <label {...props}>{children}</label>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  SelectValue: () => null,
}));

jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
}));

jest.mock("./api", () => ({
  changeCurrentSemester: jest.fn(),
  getAdminCandidates: jest.fn(),
  getCurrentSemester: jest.fn(),
  getSemesterChangePreview: jest.fn(),
  getSemesters: jest.fn(),
}));

jest.mock("./schedule-section", () => ({ ScheduleSection: () => null }));

import { toast } from "sonner";
import {
  changeCurrentSemester,
  getCurrentSemester,
  getSemesterChangePreview,
  getSemesters,
  getAdminCandidates,
} from "./api";
import { SemesterManageView } from "./semester-manage-view";

type AsyncMock = {
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
};

const mockedChangeCurrentSemester =
  changeCurrentSemester as unknown as AsyncMock;
const mockedGetCurrentSemester = getCurrentSemester as unknown as AsyncMock;
const mockedGetPreview = getSemesterChangePreview as unknown as AsyncMock;
const mockedGetSemesters = getSemesters as unknown as AsyncMock;
const mockedGetAdminCandidates = getAdminCandidates as unknown as AsyncMock;

const current = { act_year: 2026, act_semester: 2, label: "26-2" };
const target = { act_year: 2027, act_semester: 1, label: "27-1" };

describe("SemesterManageView", () => {
  beforeEach(() => {
    mockedChangeCurrentSemester.mockReset();
    mockedGetCurrentSemester.mockReset();
    mockedGetPreview.mockReset();
    mockedGetSemesters.mockReset();
    mockedGetAdminCandidates.mockReset();
    (toast.success as jest.Mock).mockReset();

    mockedGetCurrentSemester.mockResolvedValue(current);
    mockedGetSemesters.mockResolvedValue([target, current]);
    mockedGetAdminCandidates.mockResolvedValue([
      {
        user_id: 20260001,
        name: "현재 회장",
        department: "컴퓨터소프트웨어학부",
        phone_num: "010-1234-5678",
        affiliation: "운영진",
      },
    ]);
    mockedGetPreview.mockResolvedValue({
      current,
      target,
      target_team_member_count: 1,
      needs_team_setup: false,
      target_hackathon_exists: true,
      current_member_count: 10,
      current_certificate_issued_count: 10,
      has_pending_certificates: false,
    });
    mockedChangeCurrentSemester.mockResolvedValue(target);
  });

  it("requests a preview before changing to the next semester and then refetches", async () => {
    render(
      <SemesterManageView
        currentUserId={20260001}
        currentUserName="현재 회장"
      />,
    );

    const previewButton = await screen.findByRole("button", {
      name: "다음 학기(27-1)로 전환",
    });
    fireEvent.click(previewButton);

    await screen.findByRole("heading", { name: "26-2 → 27-1 전환" });
    expect(getSemesterChangePreview).toHaveBeenCalledWith(2027, 1);

    fireEvent.click(screen.getByRole("button", { name: "전환하기" }));

    await waitFor(() => {
      expect(changeCurrentSemester).toHaveBeenCalledWith({
        act_year: 2027,
        act_semester: 1,
        next_president_user_id: 20260001,
      });
    });
    expect(toast.success).toHaveBeenCalledWith(
      "활동 학기를 27-1로 전환했습니다.",
    );
    await waitFor(() => {
      expect(getCurrentSemester).toHaveBeenCalledTimes(2);
      expect(getSemesters).toHaveBeenCalledTimes(2);
      expect(getAdminCandidates).toHaveBeenCalledTimes(2);
    });
  });
});
