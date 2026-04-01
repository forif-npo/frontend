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
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
};

export type OperatorSemesterLabel = "전체" | `${number}-${number}` | "그 외";
