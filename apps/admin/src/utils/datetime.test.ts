import { describe, expect, it } from "@jest/globals";
import {
  addHoursToDateTime,
  formatDateTimeLabel,
  toDateTimeInputValue,
  toDateTimeMs,
  toInputDateTime,
  toLocalDateTime,
} from "./datetime";

describe("datetime utils", () => {
  it("keeps local date-time fields intact for form inputs and API values", () => {
    const localDate = new Date(2026, 8, 7, 9, 5);
    const value = "2026-09-07T09:05";

    expect(toDateTimeInputValue(localDate)).toBe(value);
    expect(toInputDateTime(localDate.toISOString())).toBe(value);
    expect(toLocalDateTime(value)).toBe(value);
    expect(toLocalDateTime("")).toBeUndefined();
  });

  it("rejects invalid dates and advances valid datetime-local values", () => {
    expect(toInputDateTime("not-a-date")).toBe("");
    expect(toDateTimeMs("not-a-date")).toBeNull();
    expect(addHoursToDateTime("not-a-date", 1)).toBeUndefined();
    expect(addHoursToDateTime("2026-09-07T23:30", 2)).toBe("2026-09-08T01:30");
  });

  it("formats display labels and preserves malformed non-empty values", () => {
    expect(formatDateTimeLabel("2026-09-07T09:05")).toBe("2026. 09. 07 09:05");
    expect(formatDateTimeLabel()).toBe("-");
    expect(formatDateTimeLabel("2026/09/07")).toBe("2026/09/07");
  });
});
