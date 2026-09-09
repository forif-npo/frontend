import { describe, expect, it } from "@jest/globals";
import { getObjectParticle } from "./korean-particle";

describe("getObjectParticle", () => {
  it.each([
    ["스터디", "를"],
    ["신청", "을"],
    ["  프로젝트  ", "를"],
    ["React", "을"],
    ["", "을"],
  ])("chooses %s%s", (value, expected) => {
    expect(getObjectParticle(value)).toBe(expected);
  });
});
