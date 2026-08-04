import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type {
  DuesMember,
  DuesPageData,
  DuesSort,
  UpdateDuesPayload,
} from "./types";

interface FetchDuesParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: DuesSort;
  accessToken: string;
}

type UnknownRecord = Record<string, unknown>;

function pickNumber(...values: unknown[]): number {
  const value = values.find((item) => typeof item === "number");
  return typeof value === "number" ? value : 0;
}

function pickString(...values: unknown[]): string | null {
  const value = values.find((item) => typeof item === "string");
  return typeof value === "string" ? value : null;
}

function pickBoolean(...values: unknown[]): boolean {
  const value = values.find((item) => typeof item === "boolean");
  return value === true;
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function mapMember(value: unknown): DuesMember {
  const item = asRecord(value);
  return {
    userId: pickNumber(item.userId, item.user_id),
    userName: pickString(item.userName, item.user_name) ?? "이름 없음",
    department: pickString(item.department),
    currentStudyName: pickString(
      item.currentStudyName,
      item.current_study_name,
    ),
    duesPaid: pickBoolean(item.duesPaid, item.dues_paid),
    googleFormSubmitted: pickBoolean(
      item.googleFormSubmitted,
      item.google_form_submitted,
    ),
  };
}

function mapDuesPage(value: unknown): DuesPageData {
  const item = asRecord(value);
  const semester = asRecord(item.semester);
  const summary = asRecord(item.summary);
  const content = Array.isArray(item.content) ? item.content : [];

  return {
    semester: {
      actYear: pickNumber(semester.actYear, semester.act_year),
      actSemester: pickNumber(semester.actSemester, semester.act_semester),
      label: pickString(semester.label) ?? "현재 학기",
    },
    summary: {
      totalCount: pickNumber(summary.totalCount, summary.total_count),
      duesPaidCount: pickNumber(summary.duesPaidCount, summary.dues_paid_count),
      googleFormSubmittedCount: pickNumber(
        summary.googleFormSubmittedCount,
        summary.google_form_submitted_count,
      ),
      completedCount: pickNumber(
        summary.completedCount,
        summary.completed_count,
      ),
    },
    content: content.map(mapMember),
    totalElements: pickNumber(item.totalElements, item.total_elements),
    currentPage: pickNumber(item.currentPage, item.current_page),
    totalPages: pickNumber(item.totalPages, item.total_pages),
    pageSize: pickNumber(item.pageSize, item.page_size),
  };
}

export async function fetchDues({
  page = 0,
  size = 20,
  search,
  sort = "NEEDS_ATTENTION",
  accessToken,
}: FetchDuesParams): Promise<DuesPageData> {
  const response = await apiClient
    .get("api/v1/admin/dues", {
      searchParams: {
        page: page.toString(),
        size: size.toString(),
        sort,
        ...(search ? { search } : {}),
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .json<ApiResponse<unknown>>();

  if (!response.data) {
    throw new Error(
      response.message || "회비 관리 정보를 불러오지 못했습니다.",
    );
  }

  return mapDuesPage(response.data);
}

export async function updateDues(
  userId: number,
  payload: UpdateDuesPayload,
): Promise<DuesMember> {
  const response = await apiClient
    .patch(`api/v1/admin/dues/${userId}`, { json: payload })
    .json<ApiResponse<unknown>>();

  if (!response.data) {
    throw new Error(response.message || "상태를 저장하지 못했습니다.");
  }

  return mapMember(response.data);
}
