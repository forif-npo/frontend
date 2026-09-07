import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/lib/semester", () => ({
  loadSemesterOptions: jest.fn(),
}));

import {
  buildSemesterEndpoint,
  isMainSemester,
  parseSemesterLabel,
  pickBoolean,
  pickNumber,
  pickString,
} from "./roster";

describe("roster utils", () => {
  it("parses valid semester labels and only appends valid selected semesters", () => {
    expect(parseSemesterLabel("26-2")).toEqual({ year: 2026, semester: 2 });
    expect(parseSemesterLabel("2026-02-semester")).toBeNull();
    expect(buildSemesterEndpoint("api/v1/admin/mentors", "26-2")).toBe(
      "api/v1/admin/mentors/2026/2",
    );
    expect(buildSemesterEndpoint("api/v1/admin/mentors", "그 외")).toBe(
      "api/v1/admin/mentors",
    );
  });

  it("matches primary semesters and normalizes mixed API field values", () => {
    expect(isMainSemester(new Set(["26-1"]), 2026, 1)).toBe(true);
    expect(isMainSemester(new Set(["26-1"]), 2025, 2)).toBe(false);
    expect(pickString("", 20260001, "fallback")).toBe("20260001");
    expect(pickNumber("", "not-a-number", "42")).toBe(42);
    expect(pickBoolean("false", 1)).toBe(false);
    expect(pickBoolean("unknown", 1)).toBe(true);
  });
});
