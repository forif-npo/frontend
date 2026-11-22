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

export type StaffRecruitmentQuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "FILE"
  | "LINK"
  | "ATTACHMENT";

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
  extends Omit<StaffRecruitmentCreateRequest, "act_year" | "act_semester"> {
  version: number;
}

export type StaffApplicationStatus = "SUBMITTED";

/** 면접 가능 시간 한 칸. start_minute는 자정부터의 분이다. 09:30이면 570이다. */
export interface StaffInterviewSlot {
  date: string;
  start_minute: number;
}

/**
 * 회장단이 설정한 면접 일정.
 * 칸 목록은 내려오지 않는다. dates × [start_hour, end_hour) 를 slot_minutes로 나눠 화면이 만든다.
 */
export interface StaffInterviewPlan {
  interview_plan_id: number;
  recruitment_id: number;
  dates: string[];
  start_hour: number;
  end_hour: number;
  /** 한 칸의 길이(분). 10·15·20·30·60 중 하나다. */
  slot_minutes: number;
  required: boolean;
  guide: string | null;
  version: number;
}

/** 면접 일정 조율 화면의 지원자 한 명. 시각은 날짜 + 시작 분(자정 기준)이다. */
export interface StaffInterviewScheduleApplicant {
  application_id: number;
  applicant_name: string;
  applicant_department: string | null;
  applied_departments: StaffApplicationAppliedDepartment[];
  available_slots: StaffInterviewSlot[];
  assigned_slot: StaffInterviewSlot | null;
}

/**
 * 면접 일정 조율 조회 결과.
 * 칸마다 누가 가능한지는 화면이 host_slots와 지원자 available_slots를 겹쳐 계산한다.
 */
export interface StaffInterviewSchedule {
  plan: StaffInterviewPlan;
  host_slots: StaffInterviewSlot[];
  applicants: StaffInterviewScheduleApplicant[];
  confirmed_at: string | null;
}

export interface StaffInterviewPlanSaveRequest {
  dates: string[];
  start_hour: number;
  end_hour: number;
  slot_minutes: number;
  required: boolean;
  guide: string | null;
  /** 처음 설정할 때는 보내지 않고, 수정할 때는 조회한 version을 보낸다. 다르면 서버가 거절한다. */
  version?: number;
}

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
  interview_slots: StaffInterviewSlot[];
}

export interface StaffApplicationUpdateRequest
  extends StaffApplicationSubmitRequest {
  removed_file_question_ids: number[];
}

export interface StaffApplicationSubmitResponse {
  application_id: number;
  recruitment_id: number;
  status: StaffApplicationStatus;
  submitted_at: string;
}

export interface MyStaffApplicationSummary {
  application_id: number;
  recruitment_id: number;
  act_year: number;
  act_semester: number;
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
  interview_slots: StaffInterviewSlot[];
  can_modify: boolean;
}

export type StaffReviewerStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export interface StaffReviewerCandidate {
  user_id: number;
  user_name: string;
  department: string | null;
  affiliation: string;
  has_admin_account: boolean;
  reviewer_status: StaffReviewerStatus | null;
}

export interface StaffRecruitmentReviewer {
  user_id: number;
  user_name: string;
  department: string | null;
  affiliation: string;
  status: StaffReviewerStatus;
  granted_at: string;
  expires_at: string;
  revoked_at: string | null;
}

export interface StaffReviewerGrantRequest {
  user_id: number;
  expires_at: string;
}
