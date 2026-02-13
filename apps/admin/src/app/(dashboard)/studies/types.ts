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
