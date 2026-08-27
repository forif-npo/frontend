export interface SemesterInfo {
  actYear: number;
  actSemester: number;
  label: string;
}

export interface DuesSummary {
  totalCount: number;
  duesPaidCount: number;
  googleFormSubmittedCount: number;
  completedCount: number;
}

export interface DuesMember {
  userId: number;
  userName: string;
  department: string | null;
  duesPaid: boolean;
  googleFormSubmitted: boolean;
}

export interface DuesPageData {
  semester: SemesterInfo;
  summary: DuesSummary;
  content: DuesMember[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface UpdateDuesPayload {
  userId: number;
  duesPaid?: boolean;
  googleFormSubmitted?: boolean;
}
