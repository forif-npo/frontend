import { describe, expect, it } from "@jest/globals";
import {
  emptyRecruitmentForm,
  toSaveRequest,
  validateRecruitmentForm,
} from "./form";

describe("staff recruitment form", () => {
  it("rejects an empty department and reversed schedule", () => {
    const form = emptyRecruitmentForm();
    form.title = "운영진 모집";
    form.description = "안내";
    form.startsAt = "2026-12-15T18:00";
    form.endsAt = "2026-12-01T09:00";

    expect(validateRecruitmentForm(form)).toContain("종료 시각");
  });

  it("maps ordered departments and optional questions to snake_case", () => {
    const form = emptyRecruitmentForm();
    Object.assign(form, {
      title: " 2027-1 운영진 모집 ",
      description: " 모집 안내 ",
      startsAt: "2026-12-01T09:00",
      endsAt: "2026-12-15T18:00",
      actYear: "2027",
      actSemester: "1",
    });
    form.departments = [
      { name: " 기획팀 ", description: " 기획 " },
      { name: "개발팀", description: "" },
    ];
    form.questions = [
      {
        label: "지원 동기",
        description: "",
        type: "LONG_TEXT",
        required: true,
        maxLength: "1000",
      },
    ];

    expect(validateRecruitmentForm(form)).toBeNull();
    expect(toSaveRequest(form)).toEqual(
      expect.objectContaining({
        act_year: 2027,
        act_semester: 1,
        starts_at: "2026-12-01T09:00:00+09:00",
        ends_at: "2026-12-15T18:00:00+09:00",
        departments: [
          expect.objectContaining({ name: "기획팀", display_order: 1 }),
          expect.objectContaining({ name: "개발팀", display_order: 2 }),
        ],
        questions: [
          expect.objectContaining({
            label: "지원 동기",
            max_length: 1000,
            display_order: 1,
          }),
        ],
      }),
    );
  });
});
