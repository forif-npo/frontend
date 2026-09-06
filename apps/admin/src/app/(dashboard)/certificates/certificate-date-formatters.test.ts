import { describe, expect, it } from "@jest/globals";
import {
  dateToIso,
  isoToDate,
  toDotDate,
  toIssueDate,
} from "./certificate-date-formatters";

describe("certificate date formatters", () => {
  it("keeps the certificate period format", () => {
    expect(`${toDotDate("2026-09-02")}~${toDotDate("2026-12-20")}`).toBe(
      "2026.09.02.~2026.12.20.",
    );
  });

  it("keeps the manual issue date format", () => {
    expect(toIssueDate("2026-09-02")).toBe("2026. 09. 02.");
  });

  it("round-trips the date picker value without a time component", () => {
    expect(dateToIso(isoToDate("2026-09-02"))).toBe("2026-09-02");
    expect(isoToDate("")).toBeUndefined();
    expect(dateToIso(undefined)).toBe("");
  });
});
