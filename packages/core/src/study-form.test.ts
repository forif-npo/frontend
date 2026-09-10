import { describe, expect, it } from "@jest/globals";
import { STUDY_TAG_CATEGORIES, STUDY_TAG_OPTIONS, STUDY_TAG_OPTIONS_BY_CATEGORY } from "./study-form";

describe("study tag catalog", () => {
  it("groups every tag exactly once under a declared category", () => {
    const groupedTags = STUDY_TAG_OPTIONS_BY_CATEGORY.flatMap(
      ({ options }) => options,
    );

    expect(
      STUDY_TAG_OPTIONS_BY_CATEGORY.map(({ category }) => category),
    ).toEqual(STUDY_TAG_CATEGORIES);
    expect(groupedTags.map((tag) => tag.id).sort((a, b) => a - b)).toEqual(
      STUDY_TAG_OPTIONS.map((tag) => tag.id).sort((a, b) => a - b),
    );
    expect(new Set(STUDY_TAG_OPTIONS.map((tag) => tag.id)).size).toBe(
      STUDY_TAG_OPTIONS.length,
    );
    expect(new Set(STUDY_TAG_OPTIONS.map((tag) => tag.name)).size).toBe(
      STUDY_TAG_OPTIONS.length,
    );
  });
});
