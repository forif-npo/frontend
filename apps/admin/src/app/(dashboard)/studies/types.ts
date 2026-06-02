/**
 * Admin study list item (from API)
 * Maps to AdminStudyResponse from @core/types/api
 */
export interface Study {
  id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  one_liner: string;
  mentee_count: number;
  recruit_status: "APPLICABLE" | "CLOSED";
  study_status: "PENDING" | "APPROVED" | "REJECTED" | "RE_APPLIED";
  reject_reason: string | null;
  created_at: string;
}

/**
 * Semester information
 */
export interface SemesterInfo {
  year: number;
  semester: number; // 1 or 2
}

/**
 * Semester label type for UI tabs
 */
export type SemesterLabel = "전체" | `${number}-${number}` | "그 외";

/**
 * 스터디 수정 다이얼로그 폼 상태
 */
export interface StudyEditForm {
  study_name: string;
  sub_title: string;
  one_liner: string;
  explanation: string;
  goal: string;
  start_time: string;
  end_time: string;
  week_day: string;
  location: string;
  location_detail: string;
  recruit_status: "APPLICABLE" | "CLOSED";
  difficulty: string;
  capacity: string;
  tags: number[];
}
