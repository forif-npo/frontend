import { describe, expect, it } from "@jest/globals";
import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { emptyRecruitmentForm, recruitmentToForm, toSaveRequest, validateRecruitmentForm } from "./form";

describe("staff recruitment form", () => {
  it("derives the stored title from a valid activity semester", () => {
    const form = emptyRecruitmentForm();
    form.description = "안내";
    form.startsAt = "2027-01-01";
    form.endsAt = "2027-01-02";
    form.departments = [{ name: "기획팀", description: "" }];
    form.actYear = "2027";
    form.actSemester = "1";

    expect(validateRecruitmentForm(form)).toBeNull();
    expect(toSaveRequest(form).title).toBe("2027-1");

    form.actYear = "";
    expect(validateRecruitmentForm(form)).toBe("활동 연도를 확인해주세요.");
  });

  it("rejects an empty department and reversed schedule", () => {
    const form = emptyRecruitmentForm();
    form.description = "안내";
    form.startsAt = "2026-12-15";
    form.endsAt = "2026-12-01";

    expect(validateRecruitmentForm(form)).toContain("종료 날짜");
  });

  it("maps ordered departments and optional questions to snake_case", () => {
    const form = emptyRecruitmentForm();
    Object.assign(form, {
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
        title: "2027-1",
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

  it("keeps link and file question types in the recruitment request", () => {
    const form = emptyRecruitmentForm();
    form.description = "안내";
    form.startsAt = "2026-12-01";
    form.endsAt = "2026-12-15";
    form.departments = [{ name: "개발팀", description: "" }];
    form.questions = [
      {
        label: "포트폴리오 URL",
        description: "",
        type: "LINK",
        required: false,
        maxLength: "2000",
      },
      {
        label: "파일",
        description: "",
        type: "FILE",
        required: true,
        maxLength: "5000",
      },
    ];

    expect(validateRecruitmentForm(form)).toBeNull();
    expect(
      toSaveRequest(form).questions.map((question) => question.type),
    ).toEqual(["LINK", "FILE"]);
  });

  it("rejects a second file question in one recruitment", () => {
    const form = emptyRecruitmentForm();
    form.description = "안내";
    form.startsAt = "2026-12-01";
    form.endsAt = "2026-12-15";
    form.departments = [{ name: "개발팀", description: "" }];
    form.questions = ["포트폴리오", "자기소개서"].map((label) => ({
      label,
      description: "",
      type: "FILE" as const,
      required: false,
      maxLength: "5000",
    }));

    expect(validateRecruitmentForm(form)).toBe(
      "파일 문항은 모집당 하나만 추가할 수 있습니다.",
    );
  });

  it("restores dates and existing item identities when editing", () => {
    const form = emptyRecruitmentForm();
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
      title: "기존 모집 제목",
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
      departments: [{
        department_id: 17,
        name: "기획팀",
        description: null,
        display_order: 1,
        active: false,
      }],
      questions: [{
        question_id: 29,
        label: "지원 동기",
        description: null,
        type: "LONG_TEXT",
        required: true,
        max_length: 1000,
        display_order: 1,
      }],
      updated_at: "2026-11-16T00:00:00+09:00",
    };
    expect(recruitmentToForm(saved)).toEqual(
      expect.objectContaining({
        actYear: "2026",
        actSemester: "2",
        startsAt: "2026-12-15",
        endsAt: "2026-12-15",
      }),
    );
    const update = toSaveRequest(recruitmentToForm(saved));
    expect(update.title).toBe("2026-2");
    expect(request.departments[0]).not.toHaveProperty("department_id");
    expect(update.departments).toEqual([
      {
        department_id: 17,
        name: "기획팀",
        description: null,
        display_order: 1,
        active: false,
      },
    ]);
    expect(update.questions[0]).toEqual(
      expect.objectContaining({ question_id: 29, label: "지원 동기" }),
    );
  });
});
