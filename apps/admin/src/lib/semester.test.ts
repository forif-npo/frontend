import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/features/semester/api", () => ({
  getCurrentSemester: jest.fn(),
  getSemesters: jest.fn(),
}));

import { splitSemesterOptions, toTabOptions } from "./semester";

const semester = (year: number, term: number) => ({
  act_year: year,
  act_semester: term,
  label: `${String(year % 100).padStart(2, "0")}-${term}`,
});

describe("splitSemesterOptions", () => {
  it("현재 학기까지는 최근 목록으로, 그다음 학기는 따로 나눈다", () => {
    const options = splitSemesterOptions(semester(2026, 2), [
      semester(2027, 1),
      semester(2026, 2),
      semester(2026, 1),
    ]);

    expect(options.recentLabels).toEqual(["26-2", "26-1"]);
    expect(options.nextLabel).toBe("27-1");
  });

  it("다음 학기가 목록에 없으면 null이다", () => {
    expect(splitSemesterOptions(semester(2026, 2), [semester(2026, 2)]).nextLabel).toBeNull();
  });
});

describe("toTabOptions", () => {
  it("다음 학기를 주면 전체 바로 뒤에 둔다", () => {
    expect(toTabOptions(["26-2", "26-1"], false, "27-1")).toEqual(["전체", "27-1", "26-2", "26-1"]);
  });

  it("다음 학기를 주지 않으면 기존과 같다", () => {
    expect(toTabOptions(["26-2"], true)).toEqual(["전체", "26-2", "그 외"]);
  });
});
