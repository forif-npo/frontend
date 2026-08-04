export type DuesSort =
  | "NEEDS_ATTENTION"
  | "GOOGLE_FORM_SUBMITTED"
  | "DUES_PAID"
  | "NAME";

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
  currentStudyName: string | null;
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
  duesPaid?: boolean;
  googleFormSubmitted?: boolean;
}
