import { describe, expect, it } from "@jest/globals";
import { formatStaffRecruitmentDepartment, formatStaffRecruitmentTitle, staffRecruitmentStorageTitle } from "./staff-recruitment";

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
