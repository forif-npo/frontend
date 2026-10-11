import type {
  StaffRecruitmentRound,
  StaffRecruitmentSaveRequest,
} from "@core/types/staff-recruitment";

export interface StaffRecruitmentFormState {
  title: string;
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
  }>;
  questions: Array<{
    questionId?: number;
    label: string;
    description: string;
    type: "SHORT_TEXT" | "LONG_TEXT";
    required: boolean;
    maxLength: string;
  }>;
  version?: number;
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
    description: recruitment.description,
    actYear: String(recruitment.act_year),
    actSemester: String(recruitment.act_semester) as "1" | "2",
    startsAt: recruitment.starts_at?.slice(0, 16) ?? "",
    endsAt: recruitment.ends_at?.slice(0, 16) ?? "",
    departments: recruitment.departments.map((department) => ({
      departmentId: department.department_id,
      name: department.name,
      description: department.description ?? "",
    })),
    questions: recruitment.questions.map((question) => ({
      questionId: question.question_id,
      label: question.label,
      description: question.description ?? "",
      type: question.type,
      required: question.required,
      maxLength: String(question.max_length),
    })),
    version: recruitment.version,
  };
}

function toSeoulOffset(value: string): string {
  return `${value}:00+09:00`;
}

export function validateRecruitmentForm(
  form: StaffRecruitmentFormState,
): string | null {
  if (!form.title.trim() || !form.description.trim()) {
    return "모집 제목과 안내문을 입력해주세요.";
  }
  if (!form.startsAt || !form.endsAt) {
    return "모집 시작·종료 일시를 모두 입력해주세요.";
  }
  if (new Date(form.startsAt).getTime() >= new Date(form.endsAt).getTime()) {
    return "모집 종료 시각은 시작 시각보다 뒤여야 합니다.";
  }
  if (!form.departments.some((department) => department.name.trim())) {
    return "지원 가능한 부서를 하나 이상 입력해주세요.";
  }
  if (
    form.questions.some(
      (question) =>
        !question.label.trim() ||
        !Number.isInteger(Number(question.maxLength)) ||
        Number(question.maxLength) < 1,
    )
  ) {
    return "문항 제목과 1 이상의 최대 글자 수를 확인해주세요.";
  }
  return null;
}

export function toSaveRequest(
  form: StaffRecruitmentFormState,
): StaffRecruitmentSaveRequest {
  return {
    title: form.title.trim(),
    summary: form.summary.trim() || null,
    description: form.description.trim(),
    act_year: Number(form.actYear),
    act_semester: Number(form.actSemester),
    starts_at: toSeoulOffset(form.startsAt),
    ends_at: toSeoulOffset(form.endsAt),
    departments: form.departments
      .filter((department) => department.name.trim())
      .map((department, index) => ({
        department_id: department.departmentId,
        name: department.name.trim(),
        description: department.description.trim() || null,
        display_order: index + 1,
        active: true,
      })),
    questions: form.questions.map((question, index) => ({
      question_id: question.questionId,
      label: question.label.trim(),
      description: question.description.trim() || null,
      type: question.type,
      required: question.required,
      max_length: Number(question.maxLength),
      display_order: index + 1,
    })),
    version: form.version,
  };
}
