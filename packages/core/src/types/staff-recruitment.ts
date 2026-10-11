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
  description: string;
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
  /** 관리자 optimistic lock 요청에만 사용하며 공개 응답에서는 생략될 수 있다. */
  version?: number;
}

export interface StaffRecruitmentDepartmentInput {
  department_id?: number;
  name: string;
  description: string | null;
  display_order: number;
  active: boolean;
}

export interface StaffRecruitmentQuestionInput {
  question_id?: number;
  label: string;
  description: string | null;
  type: StaffRecruitmentQuestionType;
  required: boolean;
  max_length: number;
  display_order: number;
}

export interface StaffRecruitmentSaveRequest {
  title: string;
  summary: string | null;
  description: string;
  act_year: number;
  act_semester: number;
  starts_at: string;
  ends_at: string;
  departments: StaffRecruitmentDepartmentInput[];
  questions: StaffRecruitmentQuestionInput[];
  version?: number;
}
