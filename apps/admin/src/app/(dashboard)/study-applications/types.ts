export interface StudyApplication {
  userId: number;
  userName: string;
  department: string | null;
  studyName: string;
  priority: 1 | 2;
  appliedAt: string;
}

export interface StudyApplicationPage {
  content: StudyApplication[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
