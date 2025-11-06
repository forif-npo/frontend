import { kvInstance } from "../client";
import { API_ENDPOINTS } from "../config";
import type { Study, StudyListParams, StudyListResponse } from "@/types/study";

/**
 * Study API endpoints
 */
export const studyApi = {
  /**
   * Get list of studies with filters
   * GET /api/v2/studies
   */
  getStudies: async (params?: StudyListParams): Promise<Study[]> => {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.page !== undefined)
        searchParams.append("page", params.page.toString());
      if (params.page_size !== undefined)
        searchParams.append("page_size", params.page_size.toString());
      if (params.year !== undefined)
        searchParams.append("year", params.year.toString());
      if (params.semester !== undefined)
        searchParams.append("semester", params.semester.toString());
      if (params.difficulties) {
        params.difficulties.forEach((d) =>
          searchParams.append("difficulties", d),
        );
      }
      if (params.tags) {
        params.tags.forEach((t) => searchParams.append("tags", t));
      }
      if (params.recruit_status)
        searchParams.append("recruit_status", params.recruit_status);
      if (params.search) searchParams.append("search", params.search);
    }

    const url = searchParams.toString()
      ? `${API_ENDPOINTS.studies}?${searchParams.toString()}`
      : API_ENDPOINTS.studies;

    const response = await kvInstance.get(url).json<StudyListResponse>();
    return response.data.studies;
  },

  /**
   * Get study detail by ID
   * GET /api/v2/studies/:id
   */
  getStudyDetail: async (id: number): Promise<Study> => {
    const response = await kvInstance
      .get(`${API_ENDPOINTS.studies}/${id}`)
      .json<{ success: boolean; data: Study; error: null | string }>();
    return response.data;
  },
};
