import { describe, expect, it } from "@jest/globals";
import { formatClubDepartment, normalizeClubDepartment } from "./club-department";

describe("club department names", () => {
  it("keeps the team suffix out of stored values", () => {
    expect(normalizeClubDepartment(" SW팀 ")).toBe("SW");
    expect(normalizeClubDepartment("기획팀")).toBe("기획");
    expect(normalizeClubDepartment("회장단")).toBe("회장단");
  });

  it("adds the suffix only when showing a team", () => {
    expect(formatClubDepartment("SW")).toBe("SW팀");
    expect(formatClubDepartment("SW팀")).toBe("SW팀");
    expect(formatClubDepartment("회장단")).toBe("회장단");
  });
});
