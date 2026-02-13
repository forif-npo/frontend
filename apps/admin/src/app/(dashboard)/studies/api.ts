import { apiClient } from "@core/utils/api-client";
import type { AdminStudyListResponse, ApiResponse } from "@core/types/api";
import type { SemesterInfo } from "./types";

/**
 * Calculate current academic semester based on date
 * January-June (months 1-6) → semester 1
 * July-December (months 7-12) → semester 2
 */
export async function getCurrentSemester(): Promise<SemesterInfo> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() is 0-indexed

  return {
    year,
    semester: month <= 6 ? 1 : 2,
  };
}

/**
 * Parameters for fetching studies
 */
interface FetchStudiesParams {
  size: number;
  cursor?: number;
  year?: number;
  semester?: number;
  search?: string;
}

/**
 * Fetch studies from backend API
 * Throws error if API call fails
 */
export async function fetchStudiesWithFallback(
  params: FetchStudiesParams,
): Promise<AdminStudyListResponse> {
  console.log("[Studies API] Fetching from API:", {
    endpoint: "/api/v1/studies",
    params,
  });

  const searchParams: Record<string, string> = {
    size: params.size.toString(),
  };

  if (params.cursor !== undefined) {
    searchParams.cursor = params.cursor.toString();
  }
  if (params.year !== undefined) {
    searchParams.year = params.year.toString();
  }
  if (params.semester !== undefined) {
    searchParams.semester = params.semester.toString();
  }
  if (params.search) {
    searchParams.search = params.search;
  }

  const response = await apiClient
    .get("api/v1/studies", { searchParams })
    .json<ApiResponse<AdminStudyListResponse>>();

  // Validate response structure
  if (!response.data || !response.data.content) {
    throw new Error("Invalid API response structure");
  }

  console.log("[Studies API] Success:", {
    count: response.data.content.length,
    hasNext: response.data.has_next,
    total: response.data.total_elements,
  });

  return response.data;
}
