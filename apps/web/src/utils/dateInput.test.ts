import { describe, expect, it } from "@jest/globals";
import { formatKoreanDateFromDateInput, normalizeShortDateInput, toLocalDateTimeFromDateInput } from "./dateInput";

describe("date input utils", () => {
  it("normalizes valid six- and eight-digit dates", () => {
    expect(normalizeShortDateInput("260907")).toBe("260907");
    expect(normalizeShortDateInput("2026. 09. 07")).toBe("260907");
    expect(normalizeShortDateInput(new Date(2026, 8, 7))).toBe("260907");
  });

  it("preserves invalid input while refusing to turn it into a datetime", () => {
    expect(normalizeShortDateInput("260231")).toBe("260231");
    expect(toLocalDateTimeFromDateInput("260231")).toBeNull();
    expect(toLocalDateTimeFromDateInput("2026-09-07")).toBe(
      "2026-09-07T00:00:00",
    );
  });

  it("formats only valid dates for Korean display", () => {
    expect(formatKoreanDateFromDateInput("2026-09-07")).toBe("2026년 9월 7일");
    expect(formatKoreanDateFromDateInput("invalid")).toBeNull();
  });
});
