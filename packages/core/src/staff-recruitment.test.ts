import { describe, expect, it } from "@jest/globals";
import { formatStaffRecruitmentTitle, staffRecruitmentStorageTitle } from "./staff-recruitment";

describe("staff recruitment titles", () => {
  it("stores a compact semester key and shows a readable title", () => {
    expect(staffRecruitmentStorageTitle(2027, 1)).toBe("2027-1");
    expect(formatStaffRecruitmentTitle(2027, 1)).toBe(
      "2027년 1학기 운영진 모집",
    );
  });
});
