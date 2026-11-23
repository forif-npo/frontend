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

/** 면접 질문. department_id가 null이면 모든 면접자에게 묻는 공통 질문이다. */
export interface StaffInterviewQuestion {
  question_id: number;
  department_id: number | null;
  department_name: string | null;
  content: string;
  display_order: number;
}

/** 면접 진행 상태. 보드의 네 칸과 같다. */
export type StaffInterviewStatus = "BEFORE" | "DONE" | "PASSED" | "FAILED";

/** 합격자에게 배정한 부서. 지원자의 1지망·2지망 중 하나다. */
export interface StaffInterviewPassedDepartment {
  department_id: number;
  department_name: string;
}

export interface StaffInterviewCard {
  application_id: number;
  applicant_name: string;
  assigned_slot: StaffInterviewSlot | null;
  first_department: string | null;
  second_department: string | null;
  status: StaffInterviewStatus;
  /** 합격이 아니면 null이다. */
  passed_department: StaffInterviewPassedDepartment | null;
}

/** 면접 관리 보드. 면접 길이는 slot_minutes이고, 면접 일정이 없는 회차면 null이다. */
export interface StaffInterviewBoard {
  slot_minutes: number | null;
  cards: StaffInterviewCard[];
  results_finalized: boolean;
}

export interface StaffInterviewQuestionAnswer {
  question_id: number;
  content: string;
  answer: string | null;
}

export interface StaffInterviewDepartmentQuestions {
  department_id: number;
  department_name: string;
  questions: StaffInterviewQuestionAnswer[];
}

export interface StaffInterviewExtraQuestion {
  extra_question_id: number;
  content: string;
  answer: string | null;
}

/** 면접자 한 명의 기록지. 지원서 내용은 지원서 상세 API로 따로 읽는다. */
export interface StaffInterviewSheet {
  application_id: number;
  applicant_name: string;
  status: StaffInterviewStatus;
  assigned_slot: StaffInterviewSlot | null;
  slot_minutes: number | null;
  common_questions: StaffInterviewQuestionAnswer[];
  first_department: StaffInterviewDepartmentQuestions | null;
  second_department: StaffInterviewDepartmentQuestions | null;
  extra_questions: StaffInterviewExtraQuestion[];
  /** 합격이 아니면 null이다. */
  passed_department: StaffInterviewPassedDepartment | null;
  results_finalized: boolean;
}

/** 합격자 운영진 등록 결과. 이름은 지원서에 적힌 이름이다. */
export interface StaffRegistrationResult {
  act_year: number;
  act_semester: number;
  /** 이번에 명단에 올린 합격자 */
  registered: string[];
  /** 이미 그 학기 명단에 있어 건너뛴 합격자 */
  already_members: string[];
  /** 탈퇴해 회원 정보가 없어 올리지 못한 합격자 */
  withdrawn: string[];
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
  /** 본인 지원서 조회에 포함되는 면접 공개 정보. */
  interview?: {
    assigned_slot: StaffInterviewSlot | null;
    slot_minutes: number | null;
    status: StaffInterviewStatus | null;
  } | null;
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
