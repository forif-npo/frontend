export interface SendAlimTalkRequest {
  receivers: string[];
  templateCode: string;
  studyName: string;
  responseSchedule: string;
  dateTime: string;
  location: string;
  url: string;
}

export interface SendAlimTalkResult {
  totalCount: number;
  successCount: number;
  failureCount: number;
  results: string[];
}

export const TEMPLATE_OPTIONS = [
  { value: "STUDY_RECRUITMENT_001", label: "스터디 모집 안내" },
  { value: "STUDY_SCHEDULE_002", label: "스터디 일정 안내" },
  { value: "STUDY_REMINDER_003", label: "스터디 리마인더" },
] as const;

export interface Receiver {
  name: string;
  phoneNumber: string;
  studentId: string;
}
