/** @jest-environment jsdom */
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type {
  StaffApplicationDetail,
  StaffInterviewPlan,
  StaffRecruitmentRound,
} from "@core/types/staff-recruitment";

jest.mock("./api", () => ({
  getMyStaffApplication: jest.fn(),
  getStaffInterviewPlan: jest.fn(),
  getStaffRecruitment: jest.fn(),
}));
jest.mock("./application-error", () => ({
  getStaffApplicationErrorInfo: jest.fn(),
}));
jest.mock("@core/utils/private-file-download", () => ({
  downloadPrivateFile: jest.fn(),
}));

import {
  getMyStaffApplication,
  getStaffInterviewPlan,
  getStaffRecruitment,
} from "./api";
import { MyStaffApplicationView } from "./MyStaffApplicationView";

const application = {
  application_id: 42,
  recruitment_id: 7,
  applicant_user_id: 1,
  applicant_name: "예시 지원자",
  applicant_department: null,
  applicant_email: "applicant@example.com",
  applicant_phone_num: null,
  applied_departments: [],
  status: "SUBMITTED",
  submitted_at: "2026-11-23T12:00:00+09:00",
  can_modify: false,
  answers: [],
  interview_slots: [
    { date: "2026-11-25", start_minute: 780 },
    { date: "2026-11-24", start_minute: 690 },
    { date: "2026-11-24", start_minute: 570 },
    { date: "2026-11-24", start_minute: 660 },
    { date: "2026-11-24", start_minute: 540 },
  ],
} satisfies StaffApplicationDetail;

const interviewPlan: StaffInterviewPlan = {
  interview_plan_id: 3,
  recruitment_id: 7,
  dates: ["2026-11-24", "2026-11-25"],
  start_hour: 9,
  end_hour: 22,
  slot_minutes: 30,
  required: true,
  guide: null,
  version: 1,
};

const recruitment: StaffRecruitmentRound = {
  recruitment_id: 7,
  title: "예시 운영진 모집",
  summary: null,
  description: null,
  act_year: 2027,
  act_semester: 1,
  semester_label: "2027년 1학기",
  starts_at: null,
  ends_at: null,
  publication_status: "CLOSED",
  application_status: "CLOSED",
  application_open: false,
  application_unavailable_reason: null,
  departments: [],
  questions: [],
  updated_at: "2026-11-23T12:00:00+09:00",
};

describe("MyStaffApplicationView", () => {
  beforeEach(() => {
    jest.mocked(getMyStaffApplication).mockResolvedValue(application);
    jest.mocked(getStaffInterviewPlan).mockResolvedValue(interviewPlan);
    jest.mocked(getStaffRecruitment).mockResolvedValue(recruitment);
  });

  it("shows the submitted interview availability in date and time order", async () => {
    render(
      <MyStaffApplicationView recruitmentId={7} submitted={false} embedded />,
    );

    const heading = await screen.findByRole("heading", {
      name: "면접 가능 시각",
    });
    const section = heading.closest("section");
    expect(section).not.toBeNull();
    const dates = within(section!).getAllByRole("listitem");
    expect(dates).toHaveLength(2);
    expect(dates[0].textContent).toContain("2026년 11월 24일(화)");
    expect(dates[0].textContent).toContain(
      "오전 9시 ~ 오전 10시, 오전 11시 ~ 오후 12시",
    );
    expect(dates[1].textContent).toContain("2026년 11월 25일(수)");
    expect(dates[1].textContent).toContain("오후 1시");
  });

  it("still shows saved times if the interview plan is unavailable", async () => {
    jest
      .mocked(getStaffInterviewPlan)
      .mockRejectedValue(new Error("unavailable"));
    render(
      <MyStaffApplicationView recruitmentId={7} submitted={false} embedded />,
    );

    const heading = await screen.findByRole("heading", {
      name: "면접 가능 시각",
    });
    const section = heading.closest("section");
    expect(section).not.toBeNull();
    expect(within(section!).getByText(/오전 9시, 오전 9:30/)).toBeTruthy();
  });
});
