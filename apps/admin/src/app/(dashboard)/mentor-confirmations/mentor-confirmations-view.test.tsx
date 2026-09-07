/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps } from "react";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/components/page-header", () => ({
  PageHeader: () => null,
}));

jest.mock("@/components/list/activity-semester-toggle", () => ({
  ActivitySemesterToggle: () => null,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/single-day-picker", () => ({
  SingleDayPicker: () => null,
}));

jest.mock("@/components/list/data-table", () => ({
  DataTable: ({ data }: { data: Array<{ user_name: string }> }) => (
    <div>{data.map((target) => target.user_name).join(", ")}</div>
  ),
}));

jest.mock("@ui/components/server", () => ({
  EmptyState: ({ title }: { title: string }) => <div>{title}</div>,
  InlineLoadingState: ({ message }: { message: string }) => (
    <div>{message}</div>
  ),
}));

jest.mock("./api", () => ({
  getMentorConfirmationTargets: jest.fn(),
  getMentorConfirmationViewUrl: jest.fn(),
  issueMentorConfirmations: jest.fn(),
}));

import { toast } from "sonner";
import { getMentorConfirmationTargets } from "./api";
import { MentorConfirmationsView } from "./mentor-confirmations-view";

const study = {
  id: 1,
  study_name: "React 스터디",
  primary_mentor_name: "멘토",
  secondary_mentor_name: null,
  tags: [],
  one_liner: "",
  mentee_count: 0,
  has_applications: false,
  recruit_status: "CLOSED" as const,
  week_day: null,
  difficulty: null,
  study_status: "STARTED" as const,
  reject_reason: null,
  autonomous_study: false,
  created_at: "2026-01-01",
};

const mockedGetTargets = getMentorConfirmationTargets as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
  mockRejectedValueOnce: (value: unknown) => void;
};
const mockedToastError = toast.error as unknown as { mockReset: () => void };

describe("MentorConfirmationsView", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockedGetTargets.mockReset();
    mockedToastError.mockReset();
  });

  it("does not request issuance targets for the current semester", async () => {
    render(
      <MentorConfirmationsView
        studies={[study]}
        currentSemester="26-2"
        previousSemester="26-1"
        selectedSemester="26-2"
      />,
    );

    expect(
      await screen.findByText(
        "멘토 확인서는 종료된 학기에만 발급할 수 있습니다.",
      ),
    ).not.toBeNull();
    expect(getMentorConfirmationTargets).not.toHaveBeenCalled();
  });

  it("keeps available targets when one completed-semester study request fails", async () => {
    mockedGetTargets.mockResolvedValueOnce({
      study_id: 1,
      study_name: "React 스터디",
      act_year: 2026,
      act_semester: 1,
      targets: [
        {
          user_id: 20260001,
          user_name: "홍길동",
          department: "컴퓨터소프트웨어학부",
          confirmation_status: 0,
        },
      ],
    });
    mockedGetTargets.mockRejectedValueOnce(new Error("서버 오류"));

    render(
      <MentorConfirmationsView
        studies={[study, { ...study, id: 2, study_name: "TypeScript 스터디" }]}
        currentSemester="26-2"
        previousSemester="26-1"
        selectedSemester="26-1"
      />,
    );

    expect(await screen.findByText("홍길동")).not.toBeNull();
    expect(toast.error).toHaveBeenCalledWith(
      "일부 스터디의 발급 대상을 불러오지 못했습니다. 서버 오류",
    );
  });
});
