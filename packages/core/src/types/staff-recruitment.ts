export type StaffRecruitmentPublicationStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED"
  | "CANCELED";

export type StaffRecruitmentApplicationStatus =
  | "UPCOMING"
  | "OPEN"
  | "CLOSED"
  | "CANCELED";

export type StaffRecruitmentQuestionType = "SHORT_TEXT" | "LONG_TEXT";

export interface StaffRecruitmentDepartment {
  department_id: number;
  name: string;
  description: string | null;
  display_order: number;
  active: boolean;
}

export interface StaffRecruitmentQuestion {
  question_id: number;
  label: string;
  description: string | null;
  type: StaffRecruitmentQuestionType;
  required: boolean;
  max_length: number;
  display_order: number;
}

export interface StaffRecruitmentRound {
  recruitment_id: number;
  title: string;
  summary: string | null;
  description: string | null;
  act_year: number;
  act_semester: number;
  semester_label: string;
  starts_at: string | null;
  ends_at: string | null;
  publication_status: StaffRecruitmentPublicationStatus;
  application_status: StaffRecruitmentApplicationStatus;
  application_open: boolean;
  application_unavailable_reason: string | null;
  departments: StaffRecruitmentDepartment[];
  questions: StaffRecruitmentQuestion[];
  updated_at: string;
}

export interface AdminStaffRecruitmentRound extends StaffRecruitmentRound {
  ended_at: string | null;
  close_reason: string | null;
  version: number;
}

export interface StaffRecruitmentDepartmentInput {
  name: string;
  description: string | null;
  display_order: number;
  active: boolean;
}

export interface StaffRecruitmentQuestionInput {
  label: string;
  description: string | null;
  type: StaffRecruitmentQuestionType;
  required: boolean;
  max_length: number;
  display_order: number;
}

export interface StaffRecruitmentCreateRequest {
  title: string;
  summary: string | null;
  description: string;
  act_year: number;
  act_semester: number;
  starts_at: string;
  ends_at: string;
  departments: StaffRecruitmentDepartmentInput[];
  questions: StaffRecruitmentQuestionInput[];
}

export interface StaffRecruitmentUpdateRequest
  extends StaffRecruitmentCreateRequest {
  version: number;
}

export type StaffApplicationStatus = "SUBMITTED";

export interface StaffApplicationDepartmentChoice {
  department_id: number;
  priority: 1 | 2;
}

export interface StaffApplicationAnswerInput {
  question_id: number;
  answer: string;
}

export interface StaffApplicationSubmitRequest {
  department_choices: StaffApplicationDepartmentChoice[];
  answers: StaffApplicationAnswerInput[];
}

export interface StaffApplicationSubmitResponse {
  application_id: number;
  recruitment_id: number;
  status: StaffApplicationStatus;
  submitted_at: string;
}

export interface StaffApplicationAppliedDepartment {
  department_id: number;
  name: string;
  priority: 1 | 2;
}

export interface StaffApplicationAnswer {
  question_id: number;
  question_label: string;
  question_type: StaffRecruitmentQuestionType;
  answer: string;
}

export interface StaffApplicationSummary {
  application_id: number;
  applicant_name: string;
  applicant_department: string | null;
  applied_departments: StaffApplicationAppliedDepartment[];
  status: StaffApplicationStatus;
  submitted_at: string;
}

export interface StaffApplicationDetail extends StaffApplicationSummary {
  recruitment_id: number;
  applicant_user_id: number | null;
  applicant_email: string;
  applicant_phone_num: string | null;
  answers: StaffApplicationAnswer[];
}
