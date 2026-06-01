/**
 * 스터디 난이도
 */
export type StudyDifficulty =
  | "EASY"
  | "SEMI_EASY"
  | "NORMAL"
  | "SEMI_HARD"
  | "HARD";

/**
 * 모집 상태
 */
export type RecruitStatus = "APPLICABLE" | "CLOSED";

/**
 * 스터디 정보 (GET /api/v1/studies 응답 항목)
 */
export interface Study {
  id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  recruit_status: RecruitStatus;
  one_liner: string;
  explanation: string;
  start_time: string;
  end_time: string;
  week_day: number;
  location: string;
  difficulty: StudyDifficulty;
  img_url: string;
  act_year: number;
  act_semester: number;
}

/**
 * 스터디 목록 조회 요청 파라미터
 */
export interface StudiesParams {
  cursor?: number;
  page?: number;
  size?: number;
  page_size?: number;
  year?: number;
  semester?: number;
  difficulties?: StudyDifficulty[];
  tags?: string[];
  recruit_status?: RecruitStatus;
  search?: string;
}

/**
 * 스터디 목록 조회 응답 (GET /api/v1/studies)
 */
export interface StudiesResponse {
  timestamp: number;
  data: {
    content: Study[];
    next_cursor: number | null;
    has_next: boolean;
    total_elements: number;
    current_page: number | null;
    total_pages: number | null;
  } | null;
  error_code: string | null;
  message: string;
}
