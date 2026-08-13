import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";

export async function changeAdminPassword(body: {
  current_password: string;
  new_password: string;
}): Promise<void> {
  await apiClient
    .patch("api/v1/staff/me/password", { json: body })
    .json<ApiResponse<null>>();
}
