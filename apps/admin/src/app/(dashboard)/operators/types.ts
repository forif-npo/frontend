export type Operator = {
  userId: number;
  department: string;
  name: string;
  phoneNum: string;
  title: string;
  actYear: number;
  actSemester: number;
};

export type OperatorListResult = {
  content: Operator[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

export type OperatorSemesterLabel = "전체" | `${number}-${number}` | "그 외";
