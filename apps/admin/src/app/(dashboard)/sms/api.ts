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
