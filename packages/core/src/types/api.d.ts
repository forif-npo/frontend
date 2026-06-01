/**
 * API 공통 응답 타입
 */
export interface ApiResponse<T> {
  timestamp: number;
  data: T | null;
  error_code: string | null;
  message: string;
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  timestamp: number;
  data: null;
  error_code: string;
  message: string;
}

/**
 * 회원가입 요청 타입
 */
export interface SignUpRequest {
  student_id: number;
  user_name: string;
  email: string;
  phone_num: string;
  department: string;
}

/**
 * 회원가입 응답 데이터 타입
 */
export interface SignUpData {
  access_token: string;
  refresh_token?: string;
  role: "USER" | "MENTOR";
}

/**
 * 회원가입 응답 타입
 */
export type SignUpResponse = ApiResponse<SignUpData>;

/**
 * 부원 로그인 요청 타입
 * Google OAuth Access Token을 백엔드로 전송
 */
export interface UserLoginRequest {
  access_token: string;
}

/**
 * 부원 로그인 응답 데이터 타입
 */
export interface UserLoginData {
  access_token: string;
  refresh_token?: string;
  role: "USER";
}

/**
 * 부원 로그인 응답 타입
 */
export type UserLoginResponse = ApiResponse<UserLoginData>;

/**
 * 스태프(멘토/운영진) 로그인 요청 타입
 */
export interface StaffLoginRequest {
  user_id: number;
  password: string;
}

/**
 * 스태프(멘토/운영진) 정보 타입
 */
export interface Staff {
  user_id: number;
  user_name: string;
  email: string;
  phone_num: string;
  department: string;
  img_url: string | null;
  role: "MENTOR" | "ADMIN";
}

/**
 * 일반 사용자(부원) 정보 타입
 */
export interface User {
  user_id: number;
  user_name: string;
  email: string;
  phone_num: string;
  department: string;
  img_url: string | null;
  role: "USER";
}

/**
 * 스태프 로그인 응답 데이터 타입
 */
export interface StaffLoginData {
  access_token: string;
  refresh_token?: string;
  role: "MENTOR" | "ADMIN";
}

/**
 * 스태프 로그인 응답 타입
 */
export type StaffLoginResponse = ApiResponse<StaffLoginData>;

/**
 * 토큰 갱신 응답 데이터 타입
 */
export interface RefreshTokenData {
  access_token: string;
  refresh_token?: string;
}

/**
 * 토큰 갱신 응답 타입
 */
export type RefreshTokenResponse = ApiResponse<RefreshTokenData>;

/**
 * @deprecated 스태프 로그인은 StaffLoginRequest를 사용하세요
 */
export interface MentorLoginRequest {
  student_id: string;
  password: string;
}

/**
 * @deprecated 스태프 로그인은 StaffLoginData를 사용하세요
 */
export interface MentorLoginData {
  access_token: string;
  role: "MENTOR";
}

/**
 * @deprecated 스태프 로그인은 StaffLoginResponse를 사용하세요
 */
export type MentorLoginResponse = ApiResponse<MentorLoginData>;

/**
 * ============================================
 * Admin Study Management Types
 * ============================================
 */

/**
 * 관리자 스터디 목록 응답 타입 (커서 기반 페이지네이션)
 */
export interface AdminStudyListResponse {
  content: AdminStudyResponse[];
  next_cursor: number | null;
  has_next: boolean;
  total_elements: number;
}

/**
 * 관리자 스터디 목록 아이템 타입
 */
export interface AdminStudyResponse {
  id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  one_liner: string;
  mentee_count: number;
  recruit_status: "APPLICABLE" | "CLOSED";
}

/**
 * 스터디 업데이트 요청 타입 (모든 필드 선택적)
 */
export interface StudyUpdateRequest {
  study_name?: string;
  sub_title?: string;
  one_liner?: string;
  explanation?: string;
  goal?: string;
  start_time?: string; // HH:MM 형식
  end_time?: string; // HH:MM 형식
  week_day?: number; // 0(일) ~ 6(토)
  location?: string;
  location_detail?: string;
  is_online?: boolean;
  recruit_status?: "APPLICABLE" | "CLOSED";
  difficulty?: 1 | 2 | 3 | 4 | 5;
  capacity?: number;
  selection_criteria?: string;
  requires_interview?: boolean;
  interview_date?: string; // ISO 8601 형식
  study_tag_ids?: number[];
  study_plan_list?: StudyPlanInput[]; // Use Input type for requests
  references?: ReferenceInput[]; // Use Input type for requests
}

/**
 * 스터디 계획 타입 (API Response)
 *
 * NOTE: Actual API response uses 'section' not 'topic'
 */
export interface StudyPlan {
  id?: string; // UUID in detail response
  week_num: number;
  date: string; // ISO 8601 형식
  section: string; // API uses 'section', not 'topic'
  content: string;
}

/**
 * 스터디 계획 타입 (API Request)
 *
 * Used when creating or updating studies
 */
export interface StudyPlanInput {
  week_num: number;
  date: string; // ISO 8601 형식
  topic: string; // Request uses 'topic'
  content: string;
}

/**
 * 참고 자료 타입 (API Response)
 *
 * NOTE: Actual API response uses 'reference_type' and 'content', not 'type' and 'url'
 */
export interface Reference {
  id?: string; // UUID in detail response
  reference_type: "URL" | "FILE"; // API uses 'reference_type', not 'type'
  content: string; // API uses 'content', not 'url'
}

/**
 * 참고 자료 타입 (API Request)
 *
 * Used when creating or updating studies
 */
export interface ReferenceInput {
  type: "URL" | "FILE"; // Request uses 'type'
  url: string; // Request uses 'url'
}

/**
 * 스터디 반려 요청 타입
 */
export interface StudyRejectRequest {
  reason: string;
}

/**
 * ============================================
 * Study Browsing & Details Types
 * ============================================
 */

/**
 * 스터디 목록 조회 파라미터
 */
export interface StudyListParams {
  cursor?: number;
  page?: number;
  size?: number;
  page_size?: number;
  year?: number;
  semester?: number;
  difficulties?: number[]; // 1-5
  tags?: string[];
  recruit_status?: "APPLICABLE" | "CLOSED";
  search?: string;
}

/**
 * 스터디 난이도 enum
 */
export type StudyDifficulty =
  | "EASY"
  | "NORMAL"
  | "HARD"
  | "BEGINNER"
  | "ADVANCED";

/**
 * 스터디 목록 아이템 (간단한 정보)
 *
 * NOTE: Actual API response from dev.forif.org (2026-02-10)
 * Many fields are nullable in practice
 */
export interface StudyResponse {
  id: number; // API uses 'id', not 'study_id'
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  recruit_status: "APPLICABLE" | "CLOSED";
  one_liner: string;
  explanation: string | null;
  start_time: string | null; // HH:MM format, but can be null
  end_time: string | null;
  week_day: number | null; // 0(일) ~ 6(토), but can be null
  location: string | null;
  difficulty: StudyDifficulty; // String enum, not number!
  img_url: string | null; // API uses 'img_url', not 'thumbnail_url'
  act_year: number; // API uses 'act_year', not 'year'
  act_semester: number; // API uses 'act_semester', not 'semester'
}

/**
 * 스터디 상세 정보
 *
 * NOTE: Actual API uses 'plans' not 'study_plans', and includes additional fields
 */
export interface StudyDetailResponse extends StudyResponse {
  explanation: string; // Required in detail, optional in list
  goal: string | null;
  location_detail: string | null;
  selection_criteria: string | null;
  requires_interview: boolean | null;
  interview_date: string | null; // ISO 8601
  plans: StudyPlan[]; // API uses 'plans', not 'study_plans'
  references: Reference[];
  mentors: Array<{
    mentor_id: number;
    mentor_name: string;
  }>; // Additional field in detail response
  thumbnail_image: string | null; // Separate from img_url
  capacity: number | null;
  is_online: boolean | null;
}

/**
 * 페이지네이션 응답 wrapper
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  page_size: number;
  total_elements: number;
  total_pages: number;
}

/**
 * ============================================
 * Study Application Types
 * ============================================
 */

/**
 * 스터디 신청 요청
 */
export interface StudyApplicationRequest {
  primary_study_id: number;
  primary_study_apply_reason: string;
  secondary_study_id?: number;
  secondary_study_apply_reason?: string;
}

/**
 * 스터디 신청 상태
 */
export type ApplicationStatus = "PENDING" | "ACCEPT" | "REJECT";

/**
 * 내 스터디 신청 목록 아이템
 */
export interface MyStudyApplicationResponse {
  application_id: number;
  primary_study_id: number;
  primary_study_name: string;
  primary_study_status: ApplicationStatus;
  primary_apply_reason: string;
  secondary_study_id: number | null;
  secondary_study_name: string | null;
  secondary_study_status: ApplicationStatus | null;
  secondary_apply_reason: string | null;
  applied_at: string; // ISO 8601
}

/**
 * 지원자 목록 조회 파라미터
 */
export interface ApplicantListParams {
  study_id: number;
  page?: number;
  page_size?: number;
  user_apply_status?: ApplicationStatus;
  apply_date_direction?: "ASC" | "DESC";
}

/**
 * 지원자 정보
 */
export interface ApplicantResponse {
  application_id: number;
  user_id: number;
  user_name: string;
  department: string;
  email: string;
  phone_num: string;
  apply_reason: string;
  apply_status: ApplicationStatus;
  applied_at: string; // ISO 8601
  is_primary: boolean; // true: 1지망, false: 2지망
}

/**
 * ============================================
 * User Profile & Enrollment Types
 * ============================================
 */

/**
 * 수강 스터디 정보 (간단)
 */
export interface EnrolledStudyResponse {
  study_id: number;
  study_name: string;
  thumbnail_url: string;
  primary_mentor_name: string;
  tags: string[];
  is_current: boolean; // true: 현재 수강중, false: 수강 완료
}

/**
 * 학기별 수강 스터디 그룹
 */
export interface SemesterStudiesResponse {
  year: number;
  semester: number; // 1 or 2
  semester_label: string; // "2026-1", "2025-2"
  is_current: boolean;
  studies: EnrolledStudyResponse[];
}

/**
 * ============================================
 * Mentor Study Creation Types
 * ============================================
 */

/**
 * 스터디 개설 신청 요청 (JSON part of multipart form)
 */
export interface StudyCreationRequest {
  study_name: string;
  sub_title: string;
  one_liner: string;
  explanation: string;
  goal: string;
  year: number;
  semester: number; // 1 or 2
  week_day: number; // 0(일) ~ 6(토)
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  location: string;
  location_detail: string;
  is_online: boolean;
  recruit_status: "APPLICABLE" | "CLOSED";
  difficulty: number; // 1-5
  capacity: number;
  selection_criteria: string;
  requires_interview: boolean;
  interview_date: string | null; // ISO 8601
  study_tag_ids: number[];
  study_plan_list: StudyPlanInput[]; // Use Input type for requests
  references: ReferenceInput[]; // Use Input type for requests
  secondary_mentor_id?: number;
}

/**
 * 스터디 개설 신청서 목록 아이템
 */
export interface StudyCreationApplicationResponse {
  application_id: number;
  study_name: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason: string | null;
  submitted_at: string; // ISO 8601
  reviewed_at: string | null; // ISO 8601
}

/**
 * 내가 개설한 스터디 목록
 */
export interface MyCreatedStudyResponse {
  study_id: number;
  study_name: string;
  thumbnail_url: string;
  tags: string[];
  mentee_count: number;
  capacity: number;
  recruit_status: "APPLICABLE" | "CLOSED";
  year: number;
  semester: number;
}

/**
 * 뉴스/소식 데이터 타입 (홈페이지 표시용)
 */
export interface NewsData {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: "notice" | "blog" | "faq";
  thumbnail?: string;
  link: string;
}

/**
 * ============================================
 * Community & Information Types
 * ============================================
 */

/**
 * FAQ 게시글
 */
export interface FAQResponse {
  faq_id: number;
  title: string;
  content: string;
  tags: string[];
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  view_count: number;
}

/**
 * 공지사항 게시글
 *
 * NOTE: Actual API response differs significantly from Confluence docs
 */
export interface AnnouncementResponse {
  post_id: number; // API uses 'post_id', not 'announcement_id'
  author_id: number; // Additional field in actual response
  author_name: string;
  type: string; // e.g., "공지사항"
  title: string;
  content: string;
  tag: string; // Singular, not plural
  created_at: string; // ISO 8601
  image_urls: string[]; // S3 presigned URLs
  // Fields in Confluence docs but NOT in actual API:
  // is_pinned, updated_at, view_count
}

/**
 * ============================================
 * Certificate Types
 * ============================================
 */

/**
 * 인증서 조회 파라미터
 */
export interface CertificateParams {
  study_id: number;
}

/**
 * 인증서 URL 응답
 */
export interface CertificateResponse {
  certificate_url: string; // GCS file link
  study_name: string;
  issued_at: string; // ISO 8601
}

/**
 * ============================================
 * Notification Types (Admin)
 * ============================================
 */

/**
 * 알림톡 발송 요청
 */
export interface SendNotificationRequest {
  receivers: string[]; // 전화번호 리스트
  template_code: string;
  study_name?: string;
  response_schedule?: string;
  date_time?: string;
  location?: string;
  url?: string;
}

/**
 * 알림톡 발송 응답
 */
export interface SendNotificationResponse {
  total_count: number;
  success_count: number;
  failure_count: number;
  failed_receivers: string[];
}
