import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HTTPError } from "ky";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Study } from "@/types/study";

type ApiUserInfo = {
  user_id: number;
  user_name: string;
  email: string;
  phone_num: string;
  department: string;
  img_url: string | null;
};

type UserInfo = {
  studentId: string;
  name: string;
  department: string;
  phone: string;
};

type StudyOption = {
  value: string;
  label: string;
};

type PaginatedStudies = {
  content: Study[];
};

type UseStudyApplyDataReturn = {
  currentStudy: Study | null;
  userInfo: UserInfo | null;
  studyOptions: StudyOption[];
  isLoading: boolean;
  error: Error | null;
};

export function useStudyApplyData(studyId: string): UseStudyApplyDataReturn {
  const router = useRouter();
  const [currentStudy, setCurrentStudy] = useState<Study | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [studyOptions, setStudyOptions] = useState<StudyOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [userResponse, studyResponse, studiesResponse] =
          await Promise.all([
            apiClient.get("api/v1/users/me").json<ApiResponse<ApiUserInfo>>(),

            apiClient
              .get(`api/v1/studies/${studyId}`)
              .json<ApiResponse<Study>>(),

            apiClient
              .get("api/v1/studies", {
                searchParams: {
                  page: "0",
                  size: "100",
                  recruit_status: "APPLICABLE",
                },
              })
              .json<ApiResponse<PaginatedStudies>>(),
          ]);

        if (userResponse.data) {
          setUserInfo({
            studentId: String(userResponse.data.user_id),
            name: userResponse.data.user_name,
            department: userResponse.data.department,
            phone: userResponse.data.phone_num,
          });
        }

        if (studyResponse.data) {
          setCurrentStudy(studyResponse.data);
        }

        if (studiesResponse.data) {
          const studies = studiesResponse.data.content ?? [];
          const options = studies
            .filter((study) => study.id !== parseInt(studyId))
            .map((study) => ({
              value: String(study.id),
              label: study.study_name,
            }));
          setStudyOptions(options);
        }
      } catch (err) {
        if (err instanceof HTTPError && err.response.status === 401) {
          router.replace(
            `/signin?callbackUrl=/studies/detail/${studyId}/apply`,
          );
          return;
        }
        const error =
          err instanceof Error ? err : new Error("Failed to fetch data");
        setError(error);
        console.error("Failed to fetch data:", error);
        router.push("/studies/list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studyId, router]);

  return {
    currentStudy,
    userInfo,
    studyOptions,
    isLoading,
    error,
  };
}
