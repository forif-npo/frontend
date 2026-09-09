import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { appendSortingParams } from "@/lib/list-sorting";
import type { SortingState } from "@tanstack/react-table";
import type { StudyApplication, StudyApplicationPage } from "./types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function text(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function number(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function status(value: unknown): StudyApplication["status"] {
  return value === "ACCEPT" || value === "REJECT" ? value : "PENDING";
}

function mapApplication(value: unknown): StudyApplication {
  const item = asRecord(value);
  return {
    applicationId: number(item.applicationId ?? item.application_id),
    userId: number(item.userId ?? item.user_id),
    userName: text(item.userName ?? item.user_name) ?? "이름 없음",
    department: text(item.department),
    studyId: number(item.studyId ?? item.study_id),
    studyName: text(item.studyName ?? item.study_name) ?? "스터디 없음",
    priority: number(item.priority) === 2 ? 2 : 1,
    status: status(item.status),
    autonomousStudy:
      item.autonomousStudy === true || item.autonomous_study === true,
    appliedAt: text(item.appliedAt ?? item.applied_at) ?? "",
  };
}

export async function fetchStudyApplications({
  accessToken,
  page = 0,
  size = 20,
  search,
  sorting = [],
}: {
  accessToken?: string;
  page?: number;
  size?: number;
  search?: string;
  sorting?: SortingState;
}): Promise<StudyApplicationPage> {
  const response = await apiClient
    .get("api/v1/admin/study-applications", {
      ...(accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {}),
      searchParams: (() => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (search) params.set("search", search);
        appendSortingParams(params, sorting);
        return params;
      })(),
    })
    .json<ApiResponse<UnknownRecord>>();
  if (!response.data)
    throw new Error(response.message || "신청자 목록을 불러오지 못했습니다.");
  const data = asRecord(response.data);
  const content = Array.isArray(data.content)
    ? data.content.map(mapApplication)
    : [];
  return {
    content,
    totalElements: number(data.totalElements ?? data.total_elements),
    currentPage: number(data.currentPage ?? data.current_page),
    totalPages: number(data.totalPages ?? data.total_pages),
    pageSize: size,
  };
}

export async function decideAutonomousStudyApplication(
  application: Pick<StudyApplication, "applicationId" | "studyId">,
  decision: "accept" | "reject",
): Promise<void> {
  await apiClient
    .post(
      `api/v1/admin/study-applications/${application.studyId}/${decision}`,
      {
        json: { apply_ids: [application.applicationId] },
      },
    )
    .json<ApiResponse<null>>();
}
