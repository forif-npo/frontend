import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Study } from "@/types/study";
import { kvInstance } from "@/api/client";

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
            // Fetch user info
            kvInstance.get("api/v1/user/me").json<{
              success: boolean;
              data: UserInfo;
              error: string | null;
            }>(),

            // Fetch current study
            kvInstance
              .get(`api/v2/studies/${studyId}`)
              .json<{ success: boolean; data: Study; error: string | null }>(),

            // Fetch all available studies
            kvInstance
              .get("api/v2/studies", {
                searchParams: {
                  page: 0,
                  page_size: 100,
                  recruit_status: "APPLICABLE",
                },
              })
              .json<{
                success: boolean;
                data: { studies: Study[] };
                error: string | null;
              }>(),
          ]);

        if (userResponse.success && userResponse.data) {
          setUserInfo(userResponse.data);
        }

        if (studyResponse.success && studyResponse.data) {
          setCurrentStudy(studyResponse.data);
        }

        if (studiesResponse.success && studiesResponse.data?.studies) {
          const options = studiesResponse.data.studies
            .filter((study) => study.id !== parseInt(studyId))
            .map((study) => ({
              value: String(study.id),
              label: study.study_name,
            }));
          setStudyOptions(options);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch data");
        setError(error);
        console.error("Failed to fetch data:", error);
        router.push("/study/list");
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
