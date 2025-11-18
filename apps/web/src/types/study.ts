export type RecruitStatus = "APPLICABLE" | "CLOSED";

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0: 일요일, 6: 토요일

export interface Study {
  id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  recruit_status: RecruitStatus;
  one_liner: string;
  explanation: string;
  start_time: string; // HH:mm 형식
  end_time: string; // HH:mm 형식
  week_day: WeekDay;
  location: string;
  difficulty: string;
  img_url: string;
  act_year: number;
  act_semester: number;
}

export interface StudyListParams {
  page?: number;
  page_size?: number;

  year?: number;
  semester?: number;
  difficulties?: string[];
  tags?: string[];
  recruit_status?: RecruitStatus;
  search?: string;
}

export interface StudyListResponse {
  success: boolean;
  data: {
    studies: Study[];
  };
  error: null | string;
}

/**
 * Study detail API response
 * Note: This uses success/data/error pattern specific to this API
 * Different from generic ApiResponse pattern in /api/types
 */
export interface StudyDetailResponse {
  success: boolean;
  data: Study;
  error: null | string;
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * Study filter state for UI
 * UI에서 사용하는 필터 상태 (URL params와 매핑)
 */
export interface StudyFilters {
  year?: number;
  semester?: number;
  difficulty?: string;
  tag?: string;
  recruitStatus?: RecruitStatus;
  search?: string;
}
