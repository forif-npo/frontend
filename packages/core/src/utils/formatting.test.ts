import { describe, expect, it } from "@jest/globals";
import { getObjectParticle } from "./korean-particle";
import { formatPhoneNumber } from "./phone-number";

describe("formatPhoneNumber", () => {
  it.each([
    [null, ""],
    ["010", "010"],
    ["0101234", "010-1234"],
    ["01012345678", "010-1234-5678"],
    ["010-1234-5678", "010-1234-5678"],
    [1012345678, "101-2345-678"],
  ])("formats %p as %p", (value, expected) => {
    expect(formatPhoneNumber(value)).toBe(expected);
  });
});

describe("getObjectParticle", () => {
  it.each([
    ["를", "스터디"],
    ["을", "부원"],
    ["를", "  서비스  "],
    ["을", "React"],
    ["을", ""],
  ])("returns %p for %p", (expected, value) => {
    expect(getObjectParticle(value)).toBe(expected);
  });
});
