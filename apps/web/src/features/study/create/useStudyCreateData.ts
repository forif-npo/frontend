import { useState, useEffect } from "react";
// import { apiClient } from "@core/utils/api-client";
import type { UserInfo } from "./types";

type UseStudyCreateDataReturn = {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
};

const MOCK_USER_INFO: UserInfo = {
  studentId: "2024001285",
  name: "신윤수",
  department: "컴퓨터소프트웨어학부",
  phone: "010-1234-5678",
};

export function useStudyCreateData(): UseStudyCreateDataReturn {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: API 연동 시 주석 해제
    // const fetchData = async () => {
    //   try {
    //     setIsLoading(true);
    //     setError(null);
    //     const userResponse = await apiClient.get("api/v1/user/me").json<{
    //       success: boolean;
    //       data: UserInfo;
    //       error: string | null;
    //     }>();
    //     if (userResponse.success && userResponse.data) {
    //       setUserInfo(userResponse.data);
    //     }
    //   } catch (err) {
    //     const error = err instanceof Error ? err : new Error("Failed to fetch data");
    //     setError(error);
    //     console.error("Failed to fetch user data:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchData();

    // Mock data
    setUserInfo(MOCK_USER_INFO);
    setIsLoading(false);
  }, []);

  return {
    userInfo,
    isLoading,
    error,
  };
}
