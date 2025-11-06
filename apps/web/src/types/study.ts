/**
 * Study types based on API specification
 */

// API Enums
export type DifficultyLevel =
  | "EASY"
  | "SEMI_EASY"
  | "NORMAL"
  | "SEMI_HARD"
  | "HARD";
export type RecruitStatus = "APPLICABLE" | "CLOSED";
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0: 일요일, 6: 토요일

// Study entity from API
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
  difficulty: DifficultyLevel;
  img_url: string;
  act_year: number;
  act_semester: number; // 1 or 2
}

// Study list request parameters
export interface StudyListParams {
  page?: number;
  page_size?: number;
  year?: number;
  semester?: number;
  difficulties?: DifficultyLevel[];
  tags?: string[];
  recruit_status?: RecruitStatus;
  search?: string;
}

// Study list response
export interface StudyListResponse {
  success: boolean;
  data: {
    studies: Study[];
  };
  error: null | string;
}

// Filter state for UI
export interface StudyFilters {
  year?: number;
  semester?: number;
  difficulty?: DifficultyLevel;
  tag?: string;
  recruitStatus?: RecruitStatus;
  search?: string;
}
