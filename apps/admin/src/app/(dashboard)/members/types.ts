export type Member = {
  userId: number;
  department: string;
  userName: string;
  phoneNum: string;
  isMentor: boolean;
  isAdmin: boolean;
};

export type MemberListResult = {
  content: Member[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

export type MemberSemesterLabel = "전체" | `${number}-${number}` | "그 외";
