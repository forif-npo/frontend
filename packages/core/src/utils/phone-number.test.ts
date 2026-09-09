import { describe, expect, it } from "@jest/globals";
import { formatPhoneNumber } from "./phone-number";

describe("formatPhoneNumber", () => {
  it.each([
    [null, ""],
    ["010", "010"],
    ["010-123", "010-123"],
    ["010 1234 5678", "010-1234-5678"],
    [10123456789, "101-2345-6789"],
    ["010123456789", "010-1234-5678"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatPhoneNumber(value)).toBe(expected);
  });
});
