export type Mentor = {
  mentorId: number;
  mentorName: string;
  mentorNum: number;
};

export type MentorListApiResponse = {
  timestamp: number;
  data: {
    content: Mentor[];
    nextCursor: number | null;
    hasNext: boolean;
    totalElements: number;
  };
  errorCode: string | null;
  message: string;
};

export type MentorListResult = {
  content: Mentor[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
};

export type MentorSemesterLabel = "전체" | `${number}-${number}` | "그 외";
