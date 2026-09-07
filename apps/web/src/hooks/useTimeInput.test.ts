import { describe, expect, it } from "@jest/globals";
import { normalizeTimeInput } from "./useTimeInput";

describe("normalizeTimeInput", () => {
  it.each([
    ["9:5", "09:05"],
    ["930", "09:30"],
    ["0930", "09:30"],
    ["9", "09:00"],
    [930, "09:30"],
  ])("normalizes the valid short time %p to %s", (input, expected) => {
    expect(normalizeTimeInput(input)).toBe(expected);
  });

  it.each([
    ["24:00", "24:00"],
    ["12:60", "12:60"],
    ["12345", "12345"],
    ["", ""],
    [null, ""],
  ])("keeps an invalid or empty value %p unchanged", (input, expected) => {
    expect(normalizeTimeInput(input)).toBe(expected);
  });
});
