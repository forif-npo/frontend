export interface StudyApplication {
  applicationId: number;
  userId: number;
  userName: string;
  department: string | null;
  studyId: number;
  studyName: string;
  priority: 1 | 2;
  status: "PENDING" | "ACCEPT" | "REJECT";
  autonomousStudy: boolean;
  appliedAt: string;
}

export interface StudyApplicationPage {
  content: StudyApplication[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
