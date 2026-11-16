import type { StaffRecruitmentRound, StaffRecruitmentCreateRequest, StaffRecruitmentQuestionType } from "@core/types/staff-recruitment";

export interface StaffRecruitmentFormState {
  title: string;
  summary: string;
  description: string;
  actYear: string;
  actSemester: "1" | "2";
  startsAt: string;
  endsAt: string;
  departments: Array<{
    name: string;
    description: string;
  }>;
  questions: Array<{
    label: string;
    description: string;
    type: StaffRecruitmentQuestionType;
    required: boolean;
    maxLength: string;
  }>;
}

export function emptyRecruitmentForm(): StaffRecruitmentFormState {
  return {
    title: "",
    summary: "",
    description: "",
    actYear: String(new Date().getFullYear()),
    actSemester: "1",
    startsAt: "",
    endsAt: "",
    departments: [{ name: "", description: "" }],
    questions: [],
  };
}

export function recruitmentToForm(
  recruitment: StaffRecruitmentRound,
): StaffRecruitmentFormState {
  return {
    title: recruitment.title,
    summary: recruitment.summary ?? "",
    description: recruitment.description ?? "",
    actYear: String(recruitment.act_year),
    actSemester: String(recruitment.act_semester) as "1" | "2",
    startsAt: recruitment.starts_at?.slice(0, 10) ?? "",
    endsAt: recruitment.ends_at?.slice(0, 10) ?? "",
    departments: recruitment.departments.map((department) => ({
      name: department.name,
      description: department.description ?? "",
    })),
    questions: recruitment.questions.map((question) => ({
      label: question.label,
      description: question.description ?? "",
      type: question.type,
      required: question.required,
      maxLength: String(question.max_length),
    })),
  };
}

function toSeoulOffset(date: string, time: "00:00:00" | "23:59:59"): string {
  return `${date}T${time}+09:00`;
}

export function validateRecruitmentForm(
  form: StaffRecruitmentFormState,
): string | null {
  if (!form.title.trim() || !form.description.trim()) {
    return "모집 제목과 안내문을 입력해주세요.";
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
  return null;
}

export function toSaveRequest(
  form: StaffRecruitmentFormState,
): StaffRecruitmentCreateRequest {
  return {
    title: form.title.trim(),
    summary: form.summary.trim() || null,
    description: form.description.trim(),
    act_year: Number(form.actYear),
    act_semester: Number(form.actSemester),
    starts_at: toSeoulOffset(form.startsAt, "00:00:00"),
    ends_at: toSeoulOffset(form.endsAt, "23:59:59"),
    departments: form.departments
      .filter((department) => department.name.trim())
      .map((department, index) => ({
        name: department.name.trim(),
        description: department.description.trim() || null,
        display_order: index + 1,
        active: true,
      })),
    questions: form.questions.map((question, index) => ({
      label: question.label.trim(),
      description: question.description.trim() || null,
      type: question.type,
      required: question.required,
      max_length: Number(question.maxLength),
      display_order: index + 1,
    })),
  };
}
