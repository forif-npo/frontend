/** @jest-environment jsdom */

import { beforeEach, describe, expect, it } from "@jest/globals";
import type { StudyOpenValues } from "@core/schemas";

import {
  clearStudyCreateDraft,
  loadStudyCreateDraft,
  saveStudyCreateDraft,
} from "./draft-storage";

const DRAFT_STORAGE_KEY = "study-create-draft";

describe("스터디 개설 임시저장", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("파일 썸네일과 다운로드 파일 본문을 제외하고 입력값을 저장한다", () => {
    const values = {
      title: "React 스터디",
      thumbnail: new File(["thumbnail"], "thumbnail.png"),
      references: [
        {
          type: "DOWNLOAD",
          value: new File(["reference"], "reference.pdf"),
        },
      ],
    } as Partial<StudyOpenValues>;

    expect(saveStudyCreateDraft(values)).toBe(true);

    expect(loadStudyCreateDraft()).toMatchObject({
      title: "React 스터디",
      references: [{ type: "DOWNLOAD", value: null }],
    });
  });

  it("입력값이 없으면 빈 임시저장을 만들지 않는다", () => {
    expect(saveStudyCreateDraft({})).toBe(false);
    expect(window.localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it("손상된 임시저장 데이터는 무시하고 삭제할 수 있다", () => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, "not-json");

    expect(loadStudyCreateDraft()).toBeNull();

    clearStudyCreateDraft();
    expect(window.localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });
});
