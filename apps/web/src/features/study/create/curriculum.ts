import type { StudyOpenValues } from "@core/schemas";

type Curriculum = StudyOpenValues["curriculum"];

export function addCurriculumContent(
  curriculum: Curriculum,
  weekIndex: number,
) {
  const targetWeek = curriculum[weekIndex];
  if (!targetWeek) return curriculum;

  const next = [...curriculum];
  next[weekIndex] = {
    ...targetWeek,
    contents: [...targetWeek.contents, ""],
  };
  return next;
}

export function removeCurriculumContent(
  curriculum: Curriculum,
  weekIndex: number,
  contentIndex: number,
) {
  const targetWeek = curriculum[weekIndex];
  if (!targetWeek || targetWeek.contents.length <= 1) return null;

  const next = [...curriculum];
  next[weekIndex] = {
    ...targetWeek,
    contents: targetWeek.contents.filter((_, index) => index !== contentIndex),
  };
  return next;
}

export function addCurriculumWeek(curriculum: Curriculum) {
  const lastWeek = curriculum.at(-1)?.week ?? curriculum.length;
  return [
    ...curriculum,
    { week: lastWeek + 1, date: "", topic: "", contents: [""] },
  ];
}

export function removeCurriculumWeek(
  curriculum: Curriculum,
  weekIndex: number,
) {
  if (weekIndex < 8 || curriculum.length <= 8) return null;

  return curriculum
    .filter((_, index) => index !== weekIndex)
    .map((week, index) => ({ ...week, week: index + 1 }));
}
