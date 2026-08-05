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

export interface AlimTalkTemplate {
  templateId: string;
  name: string;
  content: string;
  status: string | null;
  messageType: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  variables: string[];
  buttonLinks: string[];
}

export interface Receiver {
  userId: number;
  name: string;
  phoneNumber: string;
  department: string;
  currentStudyName: string | null;
}
