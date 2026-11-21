import type { StaffInterviewPlan, StaffInterviewPlanSaveRequest, StaffRecruitmentRound, StaffRecruitmentCreateRequest, StaffRecruitmentQuestionType } from "@core/types/staff-recruitment";
import { staffRecruitmentStorageTitle } from "@core/staff-recruitment";
import { datesInRange } from "@core/time-slot";

/** 한 칸(= 면접 한 번)의 길이로 고를 수 있는 값(분). 서버가 받는 값과 같다. */
export const INTERVIEW_SLOT_MINUTE_OPTIONS = ["10", "15", "20", "30", "60"] as const;
export type InterviewSlotMinutes = (typeof INTERVIEW_SLOT_MINUTE_OPTIONS)[number];

/** 후보 날짜가 너무 많으면 지원자가 고르기 어렵다. 서버 제한과 같다. */
export const MAX_INTERVIEW_DAYS = 14;

const INTERVIEW_GUIDE = "면접 가능 시간을 표시해주세요.";

export interface InterviewFormState {
  /** 지원서에서 면접 가능 시간을 받을지. 끄면 지원서에 시간표가 나오지 않는다. */
  enabled: boolean;
  startDate: string;
  endDate: string;
  startHour: string;
  endHour: string;
  slotMinutes: InterviewSlotMinutes;
}

export interface StaffRecruitmentFormState {
  summary: string;
  description: string;
  actYear: string;
  actSemester: "1" | "2";
  startsAt: string;
  endsAt: string;
  departments: Array<{
    departmentId?: number;
    name: string;
    description: string;
    active?: boolean;
  }>;
  questions: Array<{
    questionId?: number;
    label: string;
    description: string;
    type: StaffRecruitmentQuestionType;
    required: boolean;
    maxLength: string;
  }>;
  interview: InterviewFormState;
}

export function emptyInterviewForm(): InterviewFormState {
  return {
    enabled: true,
    startDate: "",
    endDate: "",
    startHour: "9",
    endHour: "22",
    slotMinutes: "30",
  };
}

export function emptyRecruitmentForm(): StaffRecruitmentFormState {
  return {
    summary: "",
    description: "",
    actYear: String(new Date().getFullYear()),
    actSemester: "1",
    startsAt: "",
    endsAt: "",
    departments: [{ name: "", description: "" }],
    questions: [],
    interview: emptyInterviewForm(),
  };
}

/**
 * 저장된 면접 일정을 폼 상태로 바꾼다.
 * 일정이 없는 회차는 면접 시간을 받지 않는 상태로 연다.
 */
export function interviewPlanToForm(
  plan: StaffInterviewPlan | null,
): InterviewFormState {
  if (!plan || plan.dates.length === 0) {
    return { ...emptyInterviewForm(), enabled: false };
  }
  const sorted = [...plan.dates].sort();
  const slotMinutes = String(plan.slot_minutes) as InterviewSlotMinutes;
  return {
    enabled: true,
    startDate: sorted[0] ?? "",
    endDate: sorted.at(-1) ?? "",
    startHour: String(plan.start_hour),
    endHour: String(plan.end_hour),
    slotMinutes: INTERVIEW_SLOT_MINUTE_OPTIONS.includes(slotMinutes)
      ? slotMinutes
      : "30",
  };
}

export function recruitmentToForm(
  recruitment: StaffRecruitmentRound,
  interviewPlan: StaffInterviewPlan | null = null,
): StaffRecruitmentFormState {
  return {
    summary: recruitment.summary ?? "",
    description: recruitment.description ?? "",
    actYear: String(recruitment.act_year),
    actSemester: String(recruitment.act_semester) as "1" | "2",
    startsAt: recruitment.starts_at?.slice(0, 10) ?? "",
    endsAt: recruitment.ends_at?.slice(0, 10) ?? "",
    departments: recruitment.departments.map((department) => ({
      departmentId: department.department_id,
      name: department.name,
      description: department.description ?? "",
      active: department.active,
    })),
    questions: recruitment.questions.map((question) => ({
      questionId: question.question_id,
      label: question.label,
      description: question.description ?? "",
      type: question.type,
      required: question.required,
      maxLength: String(question.max_length),
    })),
    interview: interviewPlanToForm(interviewPlan),
  };
}

function toSeoulOffset(date: string, time: "00:00:00" | "23:59:59"): string {
  return `${date}T${time}+09:00`;
}

export function validateRecruitmentForm(
  form: StaffRecruitmentFormState,
): string | null {
  const actYear = Number(form.actYear);
  if (!Number.isInteger(actYear) || actYear < 2018 || actYear > 9999) {
    return "활동 연도를 확인해주세요.";
  }
  if (!form.description.trim()) {
    return "안내문을 입력해주세요.";
  }
  if (!form.startsAt || !form.endsAt) {
    return "모집 시작·종료 날짜를 모두 입력해주세요.";
  }
  if (form.startsAt > form.endsAt) {
    return "모집 종료 날짜는 시작 날짜보다 앞설 수 없습니다.";
  }
  if (!form.departments.some((department) => department.name.trim())) {
    return "지원 가능한 부서를 하나 이상 입력해주세요.";
  }
  if (
    form.questions.some(
      (question) =>
        !question.label.trim() ||
        !Number.isInteger(Number(question.maxLength)) ||
        Number(question.maxLength) < 1 ||
        Number(question.maxLength) > 5000,
    )
  ) {
    return "문항 제목과 1~5000자의 최대 글자 수를 확인해주세요.";
  }
  if (
    form.questions.filter((question) => question.type === "FILE").length > 1
  ) {
    return "파일 문항은 모집당 하나만 추가할 수 있습니다.";
  }
  return validateInterviewForm(form.interview);
}

export function validateInterviewForm(
  interview: InterviewFormState,
): string | null {
  if (!interview.enabled) {
    return null;
  }
  if (!interview.startDate || !interview.endDate) {
    return "면접 시작·종료 날짜를 모두 입력해주세요.";
  }
  if (interview.startDate > interview.endDate) {
    return "면접 종료 날짜는 시작 날짜보다 앞설 수 없습니다.";
  }
  if (datesInRange(interview.startDate, interview.endDate).length > MAX_INTERVIEW_DAYS) {
    return `면접 기간은 최대 ${MAX_INTERVIEW_DAYS}일까지 설정할 수 있습니다.`;
  }
  const startHour = Number(interview.startHour);
  const endHour = Number(interview.endHour);
  if (
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    startHour < 0 ||
    endHour > 24 ||
    startHour >= endHour
  ) {
    return "면접 시간의 시작 시각은 종료 시각보다 앞서야 합니다.";
  }
  return null;
}

/** 면접 일정 저장 요청. 기간을 하루씩 펼쳐 후보 날짜 목록으로 보낸다. */
export function toInterviewPlanRequest(
  interview: InterviewFormState,
): StaffInterviewPlanSaveRequest {
  return {
    dates: datesInRange(interview.startDate, interview.endDate),
    start_hour: Number(interview.startHour),
    end_hour: Number(interview.endHour),
    slot_minutes: Number(interview.slotMinutes),
    required: true,
    guide: INTERVIEW_GUIDE,
  };
}

export function toSaveRequest(
  form: StaffRecruitmentFormState,
): StaffRecruitmentCreateRequest {
  return {
    title: staffRecruitmentStorageTitle(
      Number(form.actYear),
      Number(form.actSemester),
    ),
    summary: form.summary.trim() || null,
    description: form.description.trim(),
    act_year: Number(form.actYear),
    act_semester: Number(form.actSemester),
    starts_at: toSeoulOffset(form.startsAt, "00:00:00"),
    ends_at: toSeoulOffset(form.endsAt, "23:59:59"),
    departments: form.departments
      .filter((department) => department.name.trim())
      .map((department, index) => ({
        ...(department.departmentId !== undefined
          ? { department_id: department.departmentId }
          : {}),
        name: department.name.trim(),
        description: department.description.trim() || null,
        display_order: index + 1,
        active: department.active ?? true,
      })),
    questions: form.questions.map((question, index) => ({
      ...(question.questionId !== undefined
        ? { question_id: question.questionId }
        : {}),
      label: question.label.trim(),
      description: question.description.trim() || null,
      type: question.type,
      required: question.required,
      max_length: Number(question.maxLength),
      display_order: index + 1,
    })),
  };
}
