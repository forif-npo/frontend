export type Operator = {
  user_id: number;
  name: string;
  affiliation: string;
};

export type OperatorListResult = {
  content: Operator[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
};

export type OperatorSemesterLabel = "전체" | `${number}-${number}` | "그 외";
