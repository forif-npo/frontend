export interface SendAlimTalkRequest {
  receivers: string[];
  templateCode: string;
  variables: Record<string, string>;
}

export interface SendAlimTalkMessageResult {
  receiver: string;
  success: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface SendAlimTalkResult {
  templateId: string;
  totalCount: number;
  successCount: number;
  failureCount: number;
  results: SendAlimTalkMessageResult[];
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
