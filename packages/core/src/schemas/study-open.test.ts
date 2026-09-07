import { describe, expect, it } from "@jest/globals";
import { studyOpenSchema } from "./study-open";

const validStudy = {
  mentorIds: [20260001],
  studyName: "React 심화",
  oneLiner: "React를 깊게 학습합니다.",
  tags: ["React"],
  thumbnail: null,
  introduction: "가".repeat(50),
  isOnline: true,
  location: "온라인",
  room: "",
  weekDay: "1",
  startTime: "10:00",
  endTime: "12:00",
  curriculum: Array.from({ length: 8 }, (_, index) => ({
    week: index + 1,
    date: "260901",
    topic: `${index + 1}주차 주제`,
    contents: ["학습 내용"],
  })),
  difficulty: "3",
  hasInterview: false,
  interviewDate: null,
  references: [],
};

describe("studyOpenSchema", () => {
  it("accepts a complete eight-week online study application", () => {
    expect(studyOpenSchema.safeParse(validStudy).success).toBe(true);
  });

  it("requires a room for a confirmed offline location", () => {
    const result = studyOpenSchema.safeParse({
      ...validStudy,
      isOnline: false,
      location: "동아리방",
      room: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["room"],
            message: "강의실(호)을 입력해주세요.",
          }),
        ]),
      );
    }
  });

  it("requires a link value and limits each week's combined content to 500 characters", () => {
    const result = studyOpenSchema.safeParse({
      ...validStudy,
      references: [{ type: "LINK", value: "   " }],
      curriculum: validStudy.curriculum.map((week, index) =>
        index === 0 ? { ...week, contents: ["가".repeat(501)] } : week,
      ),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["references", 0, "value"],
            message: "링크를 입력해주세요.",
          }),
          expect.objectContaining({
            path: ["curriculum", 0, "contents"],
            message: "주차별 학습 내용은 전체 500자 이내로 작성해주세요.",
          }),
        ]),
      );
    }
  });
});
