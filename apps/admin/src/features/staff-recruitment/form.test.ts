import { describe, expect, it } from "@jest/globals";
import type { StaffInterviewPlan, StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { defaultQuestionMaxLength, emptyRecruitmentForm, interviewPlanToForm, recruitmentToForm, toInterviewPlanRequest, toSaveRequest, validateInterviewForm, validateRecruitmentForm } from "./form";

describe("staff recruitment form", () => {
  it("defaults short and long answers to 100 and 500 characters", () => {
    expect(defaultQuestionMaxLength("SHORT_TEXT")).toBe("100");
    expect(defaultQuestionMaxLength("LONG_TEXT")).toBe("500");
    expect(defaultQuestionMaxLength("ATTACHMENT")).toBe("5000");
  });

  it("saves one combined attachment question", () => {
    const form = emptyRecruitmentForm();
    form.interview.enabled = false;
    form.description = "안내";
    form.startsAt = "2026-12-01";
    form.endsAt = "2026-12-15";
    form.departments = [{ name: "개발팀", description: "" }];
    form.questions = [
      {
        label: "포트폴리오",
        description: "",
        type: "ATTACHMENT",
        required: true,
        maxLength: "5000",
      },
    ];

    expect(validateRecruitmentForm(form)).toBeNull();
    expect(toSaveRequest(form).questions[0].type).toBe("ATTACHMENT");
    form.questions.push({
      label: "기존 파일",
      description: "",
      type: "FILE",
      required: false,
      maxLength: "5000",
    });
    expect(validateRecruitmentForm(form)).toBe(
      "첨부파일 문항은 모집당 하나만 추가할 수 있습니다.",
    );
  });

  it("checks the server length limits before saving a recruitment", () => {
    const form = emptyRecruitmentForm();
    form.interview.enabled = false;
    form.description = "안내";
    form.startsAt = "2026-12-01";
    form.endsAt = "2026-12-15";
    form.departments = [{ name: "개발", description: "" }];
    form.questions = [{
      label: "포트폴리오",
      description: "",
      type: "ATTACHMENT",
      required: false,
      maxLength: "5000",
    }];

    form.summary = "가".repeat(201);
    expect(validateRecruitmentForm(form)).toBe("한 줄 소개는 200자 이내로 입력해주세요.");
    form.summary = "가".repeat(200);
    form.departments[0]!.name = "가".repeat(51);
    expect(validateRecruitmentForm(form)).toBe("1번째 부서명은 50자 이내로 입력해주세요.");
    form.departments[0]!.name = "가".repeat(50);
    form.departments[0]!.description = "가".repeat(201);
    expect(validateRecruitmentForm(form)).toBe("1번째 부서 설명은 200자 이내로 입력해주세요.");
    form.departments[0]!.description = "가".repeat(200);
    form.questions[0]!.label = "가".repeat(101);
    expect(validateRecruitmentForm(form)).toBe("1번째 문항 제목은 100자 이내로 입력해주세요.");
    form.questions[0]!.label = "가".repeat(100);
    form.questions[0]!.description = "가".repeat(201);
    expect(validateRecruitmentForm(form)).toBe("1번째 문항 설명은 200자 이내로 입력해주세요.");
    form.questions[0]!.description = "가".repeat(200);
    expect(validateRecruitmentForm(form)).toBeNull();
  });

  it("defaults new recruitment to the semester after the current activity semester", () => {
    expect(emptyRecruitmentForm({ act_year: 2026, act_semester: 2 })).toEqual(
      expect.objectContaining({ actYear: "2027", actSemester: "1" }),
    );
    expect(emptyRecruitmentForm({ act_year: 2026, act_semester: 1 })).toEqual(
      expect.objectContaining({ actYear: "2026", actSemester: "2" }),
    );
  });

  it("derives the stored title from a valid activity semester", () => {
    const form = emptyRecruitmentForm();
    form.interview.enabled = false;
    form.description = "안내";
    form.startsAt = "2027-01-01";
    form.endsAt = "2027-01-02";
    form.departments = [{ name: "기획", description: "" }];
    form.actYear = "2027";
    form.actSemester = "1";

    expect(validateRecruitmentForm(form)).toBeNull();
    expect(toSaveRequest(form).title).toBe("2027-1");
    expect(toSaveRequest(form).departments[0].name).toBe("기획");

    form.actYear = "";
    expect(validateRecruitmentForm(form)).toBe("활동 연도를 확인해주세요.");
  });

  it("rejects an empty department and reversed schedule", () => {
    const form = emptyRecruitmentForm();
    form.interview.enabled = false;
    form.description = "안내";
    form.startsAt = "2026-12-15";
    form.endsAt = "2026-12-01";

    expect(validateRecruitmentForm(form)).toContain("종료 날짜");
  });

  it("maps ordered departments and optional questions to snake_case", () => {
    const form = emptyRecruitmentForm();
    form.interview.enabled = false;
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
    form.interview.enabled = false;
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
    form.interview.enabled = false;
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
      "첨부파일 문항은 모집당 하나만 추가할 수 있습니다.",
    );
  });

  it("restores dates and existing item identities when editing", () => {
    const form = emptyRecruitmentForm();
    form.interview.enabled = false;
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
      departments: [
        {
          department_id: 17,
          name: "기획팀",
          description: null,
          display_order: 1,
          active: false,
        },
      ],
      questions: [
        {
          question_id: 29,
          label: "지원 동기",
          description: null,
          type: "LONG_TEXT",
          required: true,
          max_length: 1000,
          display_order: 1,
        },
      ],
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

describe("interview settings in the recruitment form", () => {
  function validForm() {
    const form = emptyRecruitmentForm();
    form.description = "안내";
    form.startsAt = "2026-11-20";
    form.endsAt = "2026-11-28";
    form.departments = [{ name: "개발팀", description: "" }];
    form.interview.startDate = "2026-12-01";
    form.interview.endDate = "2026-12-04";
    return form;
  }

  it("asks for interview times by default with 30-minute slots from 9 to 22", () => {
    expect(emptyRecruitmentForm().interview).toEqual({
      enabled: true,
      startDate: "",
      endDate: "",
      startHour: "9",
      endHour: "22",
      slotMinutes: "30",
    });
  });

  it("requires the interview period when interview times are collected", () => {
    const form = validForm();
    form.interview.endDate = "";

    expect(validateRecruitmentForm(form)).toBe(
      "면접 시작·종료 날짜를 모두 입력해주세요.",
    );
  });

  it("rejects a reversed interview period", () => {
    const form = validForm();
    form.interview.startDate = "2026-12-04";
    form.interview.endDate = "2026-12-01";

    expect(validateInterviewForm(form.interview)).toBe(
      "면접 종료 날짜는 시작 날짜보다 앞설 수 없습니다.",
    );
  });

  it("limits the interview period to fourteen days like the server", () => {
    const form = validForm();
    form.interview.startDate = "2026-12-01";
    form.interview.endDate = "2026-12-14";
    expect(validateInterviewForm(form.interview)).toBeNull();

    form.interview.endDate = "2026-12-15";
    expect(validateInterviewForm(form.interview)).toBe(
      "면접 기간은 최대 14일까지 설정할 수 있습니다.",
    );
  });

  it("rejects a start hour that is not before the end hour", () => {
    const form = validForm();
    form.interview.startHour = "22";
    form.interview.endHour = "22";

    expect(validateInterviewForm(form.interview)).toBe(
      "면접 시간의 시작 시각은 종료 시각보다 앞서야 합니다.",
    );
  });

  it("rejects interview hours outside 9 AM to 10 PM", () => {
    const form = validForm();
    form.interview.startHour = "8";
    expect(validateInterviewForm(form.interview)).toBe(
      "면접 시간은 오전 9시부터 오후 10시 사이로 설정해주세요.",
    );

    form.interview.startHour = "9";
    form.interview.endHour = "23";
    expect(validateInterviewForm(form.interview)).toBe(
      "면접 시간은 오전 9시부터 오후 10시 사이로 설정해주세요.",
    );

    form.interview.endHour = "22";
    expect(validateInterviewForm(form.interview)).toBeNull();
  });

  it("skips interview validation when interview times are not collected", () => {
    const form = validForm();
    form.interview = {
      ...form.interview,
      enabled: false,
      startDate: "",
      endDate: "",
    };

    expect(validateRecruitmentForm(form)).toBeNull();
  });

  it("expands the period into one candidate date per day", () => {
    const form = validForm();
    form.interview.slotMinutes = "20";

    expect(toInterviewPlanRequest(form.interview)).toEqual({
      dates: ["2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04"],
      start_hour: 9,
      end_hour: 22,
      slot_minutes: 20,
      required: true,
      guide: "면접 가능 시간을 표시해주세요.",
    });
  });

  it("sends the stored version only when updating an existing interview plan", () => {
    const interview = {
      enabled: true,
      startDate: "2026-12-01",
      endDate: "2026-12-01",
      startHour: "9",
      endHour: "10",
      slotMinutes: "30" as const,
    };

    expect(toInterviewPlanRequest(interview)).not.toHaveProperty("version");
    expect(toInterviewPlanRequest(interview, 3)).toMatchObject({ version: 3 });
    expect(toInterviewPlanRequest(interview, 0)).toMatchObject({ version: 0 });
  });

  it("opens a round without an interview plan with interview times turned off", () => {
    expect(interviewPlanToForm(null).enabled).toBe(false);
  });

  it("restores the period, hours and slot length from a saved plan", () => {
    const plan: StaffInterviewPlan = {
      interview_plan_id: 3,
      recruitment_id: 1,
      dates: ["2026-12-03", "2026-12-01", "2026-12-02"],
      start_hour: 10,
      end_hour: 20,
      slot_minutes: 15,
      required: true,
      guide: "면접 가능 시간을 표시해주세요.",
      version: 2,
    };

    expect(interviewPlanToForm(plan)).toEqual({
      enabled: true,
      startDate: "2026-12-01",
      endDate: "2026-12-03",
      startHour: "10",
      endHour: "20",
      slotMinutes: "15",
    });
  });
});
