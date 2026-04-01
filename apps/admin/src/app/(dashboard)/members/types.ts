export type Member = {
  userId: number;
  department: string;
  userName: string;
  phoneNum: string;
  isMentor: boolean;
  isAdmin: boolean;
};

export type MemberListApiResponse = {
  timestamp: number;
  data: {
    content: Member[];
    nextCursor: number | null;
    hasNext: boolean;
    totalElements: number;
  };
  errorCode: string | null;
  message: string;
};

export type MemberListResult = {
  content: Member[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
};

export type MemberSemesterLabel = "전체" | `${number}-${number}` | "그 외";
