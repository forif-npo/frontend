import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { SendAlimTalkRequest, SendAlimTalkResult } from "./types";

export async function sendAlimTalk(
  data: SendAlimTalkRequest,
): Promise<ApiResponse<SendAlimTalkResult>> {
  const response = await apiClient
    .post("api/v1/notifications", {
      json: data,
    })
    .json<
      ApiResponse<{
        total_count: number;
        success_count: number;
        failure_count: number;
        results: string[];
      }>
    >();

  return {
    ...response,
    data: response.data
      ? {
          totalCount: response.data.total_count,
          successCount: response.data.success_count,
          failureCount: response.data.failure_count,
          results: response.data.results,
        }
      : null,
  };
}
