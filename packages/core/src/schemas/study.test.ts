import { describe, expect, it } from "@jest/globals";
import { studyApplySchema } from "./study";

describe("studyApplySchema", () => {
  it("allows an autonomous-study application without a priority or reason", () => {
    const result = studyApplySchema.safeParse({
      primaryStudyId: 10,
      isAutonomousStudy: true,
    });

    expect(result.success).toBe(true);
  });

  it("requires a priority and a 50-character reason for a regular study", () => {
    const result = studyApplySchema.safeParse({
      primaryStudyId: 10,
      isAutonomousStudy: false,
      primaryStudyApplyReason: "짧은 지원 사유",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["priority"],
            message: "지원순위를 선택해주세요.",
          }),
          expect.objectContaining({
            path: ["primaryStudyApplyReason"],
            message: "지원 사유는 최소 50자 이상이어야 합니다.",
          }),
        ]),
      );
    }
  });

  it("accepts the regular-study boundary values and rejects a reason over 500 characters", () => {
    expect(
      studyApplySchema.safeParse({
        primaryStudyId: 10,
        isAutonomousStudy: false,
        priority: 1,
        primaryStudyApplyReason: "가".repeat(50),
      }).success,
    ).toBe(true);

    const tooLong = studyApplySchema.safeParse({
      primaryStudyId: 10,
      isAutonomousStudy: false,
      priority: 2,
      primaryStudyApplyReason: "가".repeat(501),
    });

    expect(tooLong.success).toBe(false);
    if (!tooLong.success) {
      expect(tooLong.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["primaryStudyApplyReason"],
            message: "지원 사유는 최대 500자 이하여야 합니다.",
          }),
        ]),
      );
    }
  });
});
