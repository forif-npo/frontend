import { describe, expect, it } from "@jest/globals";
import { STUDY_TAG_OPTIONS as coreStudyTagOptions } from "@core/study-form";
import {
  getStudyTagId,
  getStudyTagLabel,
  getStudyTagName,
  STUDY_TAG_OPTIONS,
  TAG_OPTIONS,
} from "./study-tags";

describe("study tag adapters", () => {
  it("uses the core tag catalog as its single source of truth", () => {
    expect(STUDY_TAG_OPTIONS).toBe(coreStudyTagOptions);
    expect(TAG_OPTIONS).toEqual(coreStudyTagOptions.map((tag) => tag.label));
  });

  it("normalizes current and legacy tag values for web consumers", () => {
    expect(getStudyTagId("frontend")).toBe(3);
    expect(getStudyTagName("프론트엔드")).toBe("frontend");
    expect(getStudyTagLabel("개인개발")).toBe("풀스택");
    expect(getStudyTagLabel("알 수 없는 태그")).toBe("알 수 없는 태그");
  });
});
