/** 스터디 모집 상태. */
export type RecruitStatus = "APPLICABLE" | "CLOSED";

/** 스터디 난이도. */
export type StudyDifficulty =
  | "EASY"
  | "SEMI_EASY"
  | "NORMAL"
  | "SEMI_HARD"
  | "HARD";

/** 요일. 0은 일요일, 6은 토요일이다. */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 스터디 커리큘럼 항목. */
export interface StudyPlan {
  id: number;
  week_num: number;
  date: string | null;
  section: string;
  content: string | null;
}

/** 스터디 참고 자료 항목. */
export interface StudyReference {
  id?: string | number;
  title?: string;
  url?: string;
  reference_type?: "FILE" | "URL";
  content?: string | null;
  file_name?: string | null;
  category?: string;
}

/** 스터디 멘토 정보. */
export interface StudyMentor {
  mentor_id: number;
  mentor_name: string;
  mentor_num: number;
}

/** web이 사용하는 스터디 조회 응답 도메인 모델이다. */
export interface Study {
  id: number;
  act_year: number;
  act_semester: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  recruit_status: RecruitStatus;
  one_liner: string;
  explanation: string;
  start_time: string | null;
  end_time: string | null;
  week_day: WeekDay;
  location: string;
  location_detail: string | null;
  difficulty: StudyDifficulty;
  img_url: string;
  thumbnail_image: string | null;
  autonomous_study: boolean;
  is_online: boolean | null;
  goal: string | null;
  selection_criteria: string | null;
  capacity: number | null;
  requires_interview: boolean | null;
  plans: StudyPlan[];
  references: StudyReference[];
  mentors: StudyMentor[];
}

/** 스터디 목록 조회 파라미터. */
export interface StudyListParams {
  cursor?: number;
  page?: number;
  size?: number;
  page_size?: number;
  year?: number;
  semester?: number;
  difficulties?: string[];
  tags?: string[];
  recruit_status?: RecruitStatus;
  search?: string;
}

/** 이전 목록 API wrapper와의 호환을 위한 타입이다. */
export interface StudyListResponse {
  success: boolean;
  data: {
    studies: Study[];
  };
  error: null | string;
}

/** 이전 단건 API wrapper와의 호환을 위한 타입이다. */
export interface StudyDetailResponse {
  success: boolean;
  data: Study;
  error: null | string;
}

/** @deprecated `StudyListParams`를 사용한다. */
export type StudiesParams = StudyListParams;

/** 커서 기반 스터디 목록 응답이다. */
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
