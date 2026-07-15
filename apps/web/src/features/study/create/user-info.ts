import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { UserInfo } from "./types";

type UserResponseData = {
  user_id: number;
  user_name: string;
  department: string;
  phone_num: string;
};

export async function fetchUserInfo(
  studentId: string,
): Promise<UserInfo | null> {
  const response = await apiClient
    .get(`api/v1/users/${studentId}`)
    .json<ApiResponse<UserResponseData>>();

  if (!response.data) return null;

  return {
    studentId: String(response.data.user_id),
    name: response.data.user_name,
    department: response.data.department,
    phone: response.data.phone_num,
  };
}
