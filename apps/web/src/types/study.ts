import type { RecruitStatus } from "@core/types/study";

/** web 스터디 목록 URL과 연결되는 화면 상태다. */
export interface StudyFilters {
  year?: number;
  semester?: number;
  difficulty?: string;
  tag?: string;
  recruitStatus?: RecruitStatus;
  search?: string;
}
