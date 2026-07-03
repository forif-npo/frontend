export type Operator = {
  /** tb_forif_team PK (수정/삭제에 사용) */
  id: number;
  userId: number;
  department: string;
  name: string;
  phoneNum: string;
  title: string;
  actYear: number;
  actSemester: number;
  introTag: string;
  selfIntro: string;
  profImgUrl: string;
  graduateYear: number | null;
};

export type OperatorListResult = {
  content: Operator[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

export type OperatorSemesterLabel = "전체" | `${number}-${number}` | "그 외";
