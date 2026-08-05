import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type {
  AlimTalkTemplate,
  SendAlimTalkRequest,
  SendAlimTalkResult,
  Receiver,
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

export interface ReceiverPage {
  receivers: Receiver[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
}

export interface CurrentSemester {
  year: number;
  semester: number;
  label: string;
}

interface CurrentSemesterResponse {
  act_year: number;
  act_semester: number;
  label: string;
}

export async function getCurrentSemester(): Promise<CurrentSemester> {
  const response = await apiClient
    .get("api/v1/semesters/current")
    .json<ApiResponse<CurrentSemesterResponse>>();

  if (!response.data) {
    throw new Error("현재 학기 정보를 불러오지 못했습니다.");
  }

  return {
    year: response.data.act_year,
    semester: response.data.act_semester,
    label: response.data.label,
  };
}

export async function getReceiverPage({
  cursor,
  search,
  semester,
}: {
  cursor?: number;
  search?: string;
  semester?: CurrentSemester;
}): Promise<ReceiverPage> {
  const endpoint = semester
    ? `api/v1/admin/users/${semester.year}/${semester.semester}`
    : "api/v1/admin/users";

  const response = await apiClient
    .get(endpoint, {
      searchParams: {
        size: 100,
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
