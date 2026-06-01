import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { SendAlimTalkRequest, SendAlimTalkResult } from "./types";

export async function sendAlimTalk(
  data: SendAlimTalkRequest,
): Promise<ApiResponse<SendAlimTalkResult>> {
  return apiClient
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
    >()
    .then(({ data: raw, ...rest }) => ({
      ...rest,
      data: raw
        ? {
            totalCount: raw.total_count,
            successCount: raw.success_count,
            failureCount: raw.failure_count,
            results: raw.results,
          }
        : null,
    }));
}
