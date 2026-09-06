/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: ComponentProps<"input">) => <input {...props} />,
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

jest.mock("@/features/semester/schedule-api", () => ({
  SEMESTER_PHASES: [
    "MENTOR_RECRUIT",
    "MENTOR_REVIEW",
    "MENTEE_RECRUIT",
    "MENTEE_REVIEW",
    "STUDY_START",
  ],
  SEMESTER_PHASE_DESCRIPTIONS: {
    MENTOR_RECRUIT: "",
    MENTOR_REVIEW: "",
    MENTEE_RECRUIT: "",
    MENTEE_REVIEW: "",
    STUDY_START: "",
  },
  SEMESTER_PHASE_LABELS: {
    MENTOR_RECRUIT: "멘토 모집",
    MENTOR_REVIEW: "멘토 검토",
    MENTEE_RECRUIT: "멘티 모집",
    MENTEE_REVIEW: "멘티 수락/거절",
    STUDY_START: "스터디 시작",
  },
  getSemesterSchedules: jest.fn(),
  saveSemesterSchedules: jest.fn(),
}));

import {
  getSemesterSchedules,
  saveSemesterSchedules,
} from "@/features/semester/schedule-api";
import { ScheduleSection } from "./schedule-section";

type ScheduleMock = {
  mockReset: () => void;
  mockResolvedValue: (value: unknown[]) => void;
};

const mockedGetSchedules = getSemesterSchedules as unknown as ScheduleMock;
const mockedSaveSchedules = saveSemesterSchedules as unknown as {
  mockReset: () => void;
};

describe("ScheduleSection", () => {
  beforeEach(() => {
    mockedGetSchedules.mockReset();
    mockedSaveSchedules.mockReset();
    mockedGetSchedules.mockResolvedValue([
      {
        id: 1,
        act_year: 2026,
        act_semester: 2,
        phase: "MENTEE_REVIEW",
        phase_label: "멘티 수락/거절",
        starts_at: "2026-09-10T09:00:00",
        ends_at: "2026-09-10T11:01:00",
        open: false,
      },
    ]);
  });

  it("does not save when deleting a saved mentee-review schedule is not confirmed", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);
    render(
      <ScheduleSection actYear={2026} actSemester={2} semesterLabel="2026-2" />,
    );

    const clearButton = await screen.findByRole("button", { name: "비우기" });
    fireEvent.click(clearButton);
    fireEvent.click(screen.getByRole("button", { name: "학기 일정 저장" }));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        "멘티 수락/거절 일정을 삭제하시겠습니까? 현재 활동 학기의 남아 있는 대기 신청은 즉시 불합격 처리되며 되돌릴 수 없습니다.",
      );
    });
    expect(saveSemesterSchedules).not.toHaveBeenCalled();
  });
});
