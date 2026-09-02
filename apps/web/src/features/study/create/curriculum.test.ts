import { describe, expect, it } from "@jest/globals";
import type { StudyOpenValues } from "@core/schemas";
import {
  addCurriculumContent,
  addCurriculumWeek,
  removeCurriculumContent,
  removeCurriculumWeek,
} from "./curriculum";

const createCurriculum = (length: number): StudyOpenValues["curriculum"] =>
  Array.from({ length }, (_, index) => ({
    week: index + 1,
    date: `2609${String(index + 1).padStart(2, "0")}`,
    topic: `주제 ${index + 1}`,
    contents: [`내용 ${index + 1}`],
  }));

describe("curriculum updates", () => {
  it("adds a blank content row without changing the original curriculum", () => {
    const curriculum = createCurriculum(8);

    expect(addCurriculumContent(curriculum, 0)).toEqual([
      { ...curriculum[0], contents: ["내용 1", ""] },
      ...curriculum.slice(1),
    ]);
    expect(curriculum[0].contents).toEqual(["내용 1"]);
  });

  it("does not remove the last remaining content row", () => {
    const curriculum = createCurriculum(8);

    expect(removeCurriculumContent(curriculum, 0, 0)).toBeNull();
  });

  it("removes one of multiple content rows", () => {
    const curriculum = createCurriculum(8);
    curriculum[0] = { ...curriculum[0], contents: ["첫 번째", "두 번째"] };

    expect(removeCurriculumContent(curriculum, 0, 0)?.[0].contents).toEqual([
      "두 번째",
    ]);
  });

  it("adds a week after the current last week number", () => {
    const curriculum = createCurriculum(8);
    curriculum[7] = { ...curriculum[7], week: 10 };

    expect(addCurriculumWeek(curriculum).at(-1)).toEqual({
      week: 11,
      date: "",
      topic: "",
      contents: [""],
    });
  });

  it("keeps the minimum eight weeks and renumbers a removable week", () => {
    const eightWeeks = createCurriculum(8);
    const nineWeeks = createCurriculum(9);

    expect(removeCurriculumWeek(eightWeeks, 8)).toBeNull();
    expect(removeCurriculumWeek(nineWeeks, 7)).toBeNull();
    expect(removeCurriculumWeek(nineWeeks, 8)).toEqual(createCurriculum(8));
  });
});
