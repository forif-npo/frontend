import { apiClient } from "../utils/api-client";
import type { StudiesParams, StudiesResponse } from "../types/study";

/**
 * 스터디 목록 조회
 * GET /api/v1/studies
 */
export const getStudies = async (
  params?: StudiesParams,
): Promise<StudiesResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params?.page_size !== undefined) {
    searchParams.set("page_size", String(params.page_size));
  }
  if (params?.year !== undefined) {
    searchParams.set("year", String(params.year));
  }
  if (params?.semester !== undefined) {
    searchParams.set("semester", String(params.semester));
  }
  if (params?.difficulties && params.difficulties.length > 0) {
    for (const d of params.difficulties) {
      searchParams.append("difficulties", d);
    }
  }
  if (params?.tags && params.tags.length > 0) {
    for (const t of params.tags) {
      searchParams.append("tags", t);
    }
  }
  if (params?.recruit_status) {
    searchParams.set("recruit_status", params.recruit_status);
  }
  if (params?.search) {
    searchParams.set("search", params.search);
  }

  return await apiClient
    .get("api/v1/studies", { searchParams })
    .json<StudiesResponse>();
};
