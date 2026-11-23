import { describe, expect, it } from "@jest/globals";
import { formatStaffInterviewAvailability, formatStaffRecruitmentDepartment, formatStaffRecruitmentTitle, staffRecruitmentStorageTitle } from "./staff-recruitment";

describe("staff recruitment titles", () => {
  it("stores a compact semester key and shows a readable title", () => {
    expect(staffRecruitmentStorageTitle(2027, 1)).toBe("2027-1");
    expect(formatStaffRecruitmentTitle(2027, 1)).toBe(
      "2027년 1학기 운영진 모집",
    );
  });
});

describe("staff recruitment departments", () => {
  it("adds 팀 when showing a stored department name", () => {
    expect(formatStaffRecruitmentDepartment("회계")).toBe("회계팀");
    expect(formatStaffRecruitmentDepartment("기획팀")).toBe("기획팀");
  });
});

describe("staff interview availability", () => {
  const slots = [
    { date: "2026-11-25", start_minute: 780 },
    { date: "2026-11-24", start_minute: 570 },
    { date: "2026-11-24", start_minute: 540 },
    { date: "2026-11-24", start_minute: 660 },
  ];

  it("sorts dates and combines consecutive slots with the plan length", () => {
    expect(formatStaffInterviewAvailability(slots, 30)).toEqual([
      {
        date: "2026-11-24",
        dateLabel: "2026년 11월 24일(화)",
        timeLabel: "오전 9시 ~ 오전 10시, 오전 11시",
      },
      {
        date: "2026-11-25",
        dateLabel: "2026년 11월 25일(수)",
        timeLabel: "오후 1시",
      },
    ]);
  });

  it("shows individual times when the plan is unavailable", () => {
    expect(formatStaffInterviewAvailability(slots, null)[0]?.timeLabel).toBe(
      "오전 9시, 오전 9:30, 오전 11시",
    );
  });
});
