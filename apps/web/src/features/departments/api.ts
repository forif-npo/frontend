import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";

export interface DepartmentOption {
  department_id: number;
  department: string;
  college_id: number;
  college: string;
}

export async function getDepartments(): Promise<DepartmentOption[]> {
  const response = await apiClient
    .get("api/v1/departments")
    .json<ApiResponse<DepartmentOption[]>>();
  return response.data ?? [];
}
