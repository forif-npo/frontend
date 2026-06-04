export type Mentor = {
  userId: number;
  name: string;
  department: string;
  phoneNum: string;
  studyName: string;
};

export type MentorListResult = {
  content: Mentor[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

export type MentorSemesterLabel = "전체" | `${number}-${number}` | "그 외";
