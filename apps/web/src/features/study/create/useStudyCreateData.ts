import { useState, useEffect } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { UserInfo } from "./types";

type ApiUserInfo = {
  user_id: number;
  user_name: string;
  email: string;
  phone_num: string;
  department: string;
  img_url: string | null;
};

type UseStudyCreateDataReturn = {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
};

export function useStudyCreateData(): UseStudyCreateDataReturn {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient
          .get("api/v1/users/me")
          .json<ApiResponse<ApiUserInfo>>();

        if (response.data) {
          setUserInfo({
            studentId: String(response.data.user_id),
            name: response.data.user_name,
            department: response.data.department,
            phone: response.data.phone_num,
          });
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch data");
        setError(error);
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    userInfo,
    isLoading,
    error,
  };
}
