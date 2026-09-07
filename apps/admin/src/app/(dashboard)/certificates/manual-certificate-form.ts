import { getObjectParticle } from "@core/utils/korean-particle";
import type { ManualCertificateBody } from "./api";
import { toDotDate, toIssueDate } from "./certificate-date-formatters";

export interface ManualCertificateForm {
  userName: string;
  studentNumber: string;
  department: string;
  studyName: string;
  /** yyyy-MM-dd (date input 값) */
  startDate: string;
  endDate: string;
  issueDate: string;
  presidentName: string;
}

export const EMPTY_MANUAL_CERTIFICATE_FORM: ManualCertificateForm = {
  userName: "",
  studentNumber: "",
  department: "",
  studyName: "",
  startDate: "",
  endDate: "",
  issueDate: "",
  presidentName: "",
};

/** 기존 수동 발급 화면의 입력 규칙을 UI와 분리한다. */
export function validateManualCertificateForm(
  form: ManualCertificateForm,
): string | null {
  const required: [string, string][] = [
    [form.userName, "이름"],
    [form.studentNumber, "학번"],
    [form.department, "학과"],
    [form.studyName, "스터디명"],
    [form.startDate, "활동 시작일"],
    [form.endDate, "활동 종료일"],
  ];
  const missing = required.find(([value]) => !value.trim());
  if (missing) {
    return `${missing[1]}${getObjectParticle(missing[1])} 입력해주세요.`;
  }
  if (form.startDate > form.endDate) {
    return "활동 시작일이 종료일보다 늦을 수 없습니다.";
  }
  return null;
}

/** 화면 입력을 기존 수동 발급 API 요청 형식으로 바꾼다. */
export function toManualCertificateBody(
  form: ManualCertificateForm,
): ManualCertificateBody {
  return {
    user_name: form.userName.trim(),
    student_number: form.studentNumber.trim(),
    department: form.department.trim(),
    study_name: form.studyName.trim(),
    activity_period: `${toDotDate(form.startDate)}~${toDotDate(form.endDate)}`,
    issue_date: form.issueDate ? toIssueDate(form.issueDate) : undefined,
    president_name: form.presidentName.trim() || undefined,
  };
}
