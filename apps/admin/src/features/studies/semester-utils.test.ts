import { describe, expect, it } from "@jest/globals";
import { parseStudySemesterFilter } from "./semester-utils";

describe("parseStudySemesterFilter", () => {
  it("converts a two-digit regular semester label to API filters", () => {
    expect(parseStudySemesterFilter("26-2")).toEqual({
      year: 2026,
      semester: 2,
    });
  });

  it.each(["전체", "그 외", "2026-1", "26-3"] as const)(
    "returns an empty filter for %s",
    (semester) => {
      expect(parseStudySemesterFilter(semester)).toEqual({});
    },
  );
});
