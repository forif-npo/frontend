import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { SendAlimTalkRequest, SendAlimTalkResult } from "./types";

export async function sendAlimTalk(
  data: SendAlimTalkRequest,
): Promise<ApiResponse<SendAlimTalkResult>> {
  return await apiClient
    .post("api/v1/notifications", {
      json: data,
    })
    .json<ApiResponse<SendAlimTalkResult>>();
}
