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
  has_applications: boolean;
  recruit_status: "APPLICABLE" | "CLOSED";
  week_day: number | null;
  difficulty: "EASY" | "SEMI_EASY" | "NORMAL" | "SEMI_HARD" | "HARD" | null;
  study_status: "PENDING" | "APPROVED" | "STARTED" | "REJECTED" | "RE_APPLIED";
  reject_reason: string | null;
  autonomous_study: boolean;
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
  secondary_mentor_id: number | null;
  secondary_mentor_name: string | null;
  study_name: string;
  one_liner: string;
  explanation: string;
  thumbnail: File | null;
  is_online: boolean;
  start_time: string;
  end_time: string;
  week_day: string;
  location: string;
  location_detail: string;
  difficulty: string;
  tags: number[];
  curriculum: Array<{
    week: number;
    date: string;
    topic: string;
    contents: string[];
  }>;
  requires_interview: boolean;
  interview_date: string;
  references: Array<{
    id?: string;
    type: "LINK" | "DOWNLOAD";
    value: string | File | null;
    file_name?: string | null;
    original_value?: string | null;
    original_type?: "LINK" | "DOWNLOAD";
  }>;
}
