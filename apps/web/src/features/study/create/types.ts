import type { StudyOpenValues } from "@core/schemas";

export type StudyCreateStep = 1 | 2 | 3 | 4 | 5 | 6; // 6 = 완료

export type UserInfo = {
  studentId: string;
  name: string;
  department: string;
  phone: string;
};

export type CurriculumRow = {
  week: number;
  date: string;
  topic: string;
  contents: string[];
};

export type Reference = {
  type: string;
  value: string;
};

export type StudyCreateFormValues = StudyOpenValues;
