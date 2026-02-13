import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { kvInstance } from "@/api/client";
import type { UserInfo } from "./types";

type UseStudyCreateDataReturn = {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
};

export function useStudyCreateData(): UseStudyCreateDataReturn {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userResponse = await kvInstance.get("api/v1/user/me").json<{
          success: boolean;
          data: UserInfo;
          error: string | null;
        }>();

        if (userResponse.success && userResponse.data) {
          setUserInfo(userResponse.data);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch data");
        setError(error);
        console.error("Failed to fetch user data:", error);
        router.push("/study/list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return {
    userInfo,
    isLoading,
    error,
  };
}
