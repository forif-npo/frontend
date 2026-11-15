import { describe, expect, it } from "@jest/globals";
import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { emptyRecruitmentForm, recruitmentToForm, toSaveRequest, validateRecruitmentForm } from "./form";

describe("staff recruitment form", () => {
  it("rejects an empty department and reversed schedule", () => {
    const form = emptyRecruitmentForm();
    form.title = "운영진 모집";
    form.description = "안내";
    form.startsAt = "2026-12-15";
    form.endsAt = "2026-12-01";

    expect(validateRecruitmentForm(form)).toContain("종료 날짜");
  });

  it("maps ordered departments and optional questions to snake_case", () => {
    const form = emptyRecruitmentForm();
    Object.assign(form, {
      title: " 2027-1 운영진 모집 ",
      description: " 모집 안내 ",
      startsAt: "2026-12-01",
      endsAt: "2026-12-15",
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
        starts_at: "2026-12-01T00:00:00+09:00",
        ends_at: "2026-12-15T23:59:59+09:00",
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

  it("allows a single-day period and restores dates when editing", () => {
    const form = emptyRecruitmentForm();
    form.title = "운영진 모집";
    form.description = "안내";
    form.startsAt = "2026-12-15";
    form.endsAt = "2026-12-15";
    form.departments = [{ name: "기획팀", description: "" }];

    expect(validateRecruitmentForm(form)).toBeNull();
    const request = toSaveRequest(form);
    expect(request.starts_at).toBe("2026-12-15T00:00:00+09:00");
    expect(request.ends_at).toBe("2026-12-15T23:59:59+09:00");

    const saved: StaffRecruitmentRound = {
      recruitment_id: 1,
      title: form.title,
      summary: null,
      description: form.description,
      act_year: 2026,
      act_semester: 2,
      semester_label: "26-2",
      starts_at: request.starts_at,
      ends_at: request.ends_at,
      publication_status: "DRAFT",
      application_status: "CLOSED",
      application_open: false,
      application_unavailable_reason: null,
      departments: [],
      questions: [],
      updated_at: "2026-11-16T00:00:00+09:00",
    };
    expect(recruitmentToForm(saved)).toEqual(
      expect.objectContaining({
        startsAt: "2026-12-15",
        endsAt: "2026-12-15",
      }),
    );
  });
});
