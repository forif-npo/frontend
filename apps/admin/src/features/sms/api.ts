import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type {
  AlimTalkTemplate,
  AlimTalkHistoryItem,
  AlimTalkHistoryPage,
  SendAlimTalkRequest,
  SendAlimTalkResult,
  Receiver,
  ReceiverTarget,
} from "./types";

interface AlimTalkTemplateResponse {
  template_id: string;
  name: string;
  content: string;
  status: string | null;
  message_type: string | null;
  date_created: string | null;
  date_updated: string | null;
  variables: string[];
  button_links: string[];
}

interface MemberResponse {
  user_id: number;
  department: string;
  user_name: string;
  phone_num: string | null;
  current_study_name: string | null;
}

interface CursorPage<T> {
  content: T[];
  next_cursor: number | null;
  has_next: boolean;
  total_elements: number;
}

interface AlimTalkHistoryItemResponse {
  message_id: string;
  template_id: string | null;
  receiver: string | null;
  status: string | null;
  status_code: string | null;
  created_at: string | null;
  processed_at: string | null;
  reported_at: string | null;
  updated_at: string | null;
}

interface AlimTalkHistoryPageResponse {
  content: AlimTalkHistoryItemResponse[];
  next_cursor: string | null;
  has_next: boolean;
}

export interface ReceiverPage {
  receivers: Receiver[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
}

export async function getReceiverPage({
  cursor,
  search,
  target,
}: {
  cursor?: number;
  search?: string;
  target: ReceiverTarget;
}): Promise<ReceiverPage> {
  const response = await apiClient
    .get("api/v1/notifications/receivers", {
      searchParams: {
        size: 100,
        target_type: target,
        ...(cursor !== undefined ? { cursor } : {}),
        ...(search ? { search } : {}),
      },
    })
    .json<ApiResponse<CursorPage<MemberResponse>>>();

  const page = response.data;
  return {
    receivers: (page?.content ?? [])
      .filter((member) => member.phone_num)
      .map((member) => ({
        userId: member.user_id,
        name: member.user_name,
        phoneNumber: member.phone_num as string,
        department: member.department,
        currentStudyName: member.current_study_name,
      })),
    nextCursor: page?.next_cursor ?? null,
    hasNext: page?.has_next ?? false,
    totalElements: page?.total_elements ?? 0,
  };
}

/** 현재 대상·검색 조건의 모든 수신자를 페이지 단위로 가져온다. */
export async function getAllReceivers({
  search,
  target,
}: {
  search?: string;
  target: ReceiverTarget;
}): Promise<Receiver[]> {
  const receiverByPhoneNumber = new Map<string, Receiver>();
  const seenCursors = new Set<number>();
  let cursor: number | undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await getReceiverPage({ cursor, search, target });
    page.receivers.forEach((receiver) => {
      receiverByPhoneNumber.set(receiver.phoneNumber, receiver);
    });

    hasNextPage = page.hasNext;
    if (hasNextPage) {
      if (page.nextCursor === null) {
        throw new Error("수신자 목록의 다음 페이지 정보를 확인할 수 없습니다.");
      }
      if (seenCursors.has(page.nextCursor)) {
        throw new Error("수신자 목록 페이지를 계속 불러올 수 없습니다.");
      }
      seenCursors.add(page.nextCursor);
      cursor = page.nextCursor;
    }
  }

  return Array.from(receiverByPhoneNumber.values());
}

export async function getAlimTalkTemplates(): Promise<AlimTalkTemplate[]> {
  const response = await apiClient
    .get("api/v1/notifications/templates")
    .json<ApiResponse<AlimTalkTemplateResponse[]>>();

  return (response.data ?? []).map((template) => ({
    templateId: template.template_id,
    name: template.name,
    content: template.content,
    status: template.status,
    messageType: template.message_type,
    dateCreated: template.date_created,
    dateUpdated: template.date_updated,
    variables: template.variables ?? [],
    buttonLinks: template.button_links ?? [],
  }));
}

function toAlimTalkHistoryItem(
  item: AlimTalkHistoryItemResponse,
): AlimTalkHistoryItem {
  return {
    messageId: item.message_id,
    templateId: item.template_id,
    receiver: item.receiver,
    status: item.status,
    statusCode: item.status_code,
    createdAt: item.created_at,
    processedAt: item.processed_at,
    reportedAt: item.reported_at,
    updatedAt: item.updated_at,
  };
}

export async function getAlimTalkHistory({
  cursor,
}: {
  cursor?: string;
} = {}): Promise<AlimTalkHistoryPage> {
  const response = await apiClient
    .get("api/v1/notifications/history", {
      searchParams: {
        size: 50,
        ...(cursor ? { cursor } : {}),
      },
    })
    .json<ApiResponse<AlimTalkHistoryPageResponse>>();

  const page = response.data;
  return {
    content: (page?.content ?? []).map(toAlimTalkHistoryItem),
    nextCursor: page?.next_cursor ?? null,
    hasNext: page?.has_next ?? false,
  };
}

export async function sendAlimTalk(
  data: SendAlimTalkRequest,
): Promise<ApiResponse<SendAlimTalkResult>> {
  return apiClient
    .post("api/v1/notifications", {
      json: data,
    })
    .json<
      ApiResponse<{
        template_id: string;
        total_count: number;
        success_count: number;
        failure_count: number;
        results: Array<{
          receiver: string;
          success: boolean;
          error_code: string | null;
          error_message: string | null;
        }>;
      }>
    >()
    .then(({ data: raw, ...rest }) => ({
      ...rest,
      data: raw
        ? {
            templateId: raw.template_id,
            totalCount: raw.total_count,
            successCount: raw.success_count,
            failureCount: raw.failure_count,
            results: raw.results.map((result) => ({
              receiver: result.receiver,
              success: result.success,
              errorCode: result.error_code,
              errorMessage: result.error_message,
            })),
          }
        : null,
    }));
}
