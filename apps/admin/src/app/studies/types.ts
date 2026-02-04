export interface Study {
  studyId: number;
  studyName: string;
  primaryMentorName: string;
  secondaryMentorName?: string | null;
  tag: string;
  oneLiner: string;
  startTime: string;
  endTime: string;
  weekDay: number; // 1-7
  location: string;
  difficulty: number; // 1-5
  imgUrl: string;
}

export interface SemesterInfo {
  year: number;
  semester: number; // 1 or 2
}

export interface StudiesResponse {
  year: number;
  semester: number;
  semesterLabel: string;
  isCurrent: boolean;
  studies: Study[];
}

export type SemesterLabel = "전체" | `${number}-${number}` | "그 외";
