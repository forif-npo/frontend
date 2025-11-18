"use client";

import { useState, useEffect } from "react";
import { StudyApplyInfoStep } from "@/features/study/apply/study-apply-info-step";
import { StudyApplyReasonStep } from "@/features/study/apply/study-apply-reason-step";
import { useRouter } from "next/navigation";
import { Study } from "@/types/study";
import { StudyApplyValues } from "@core/schemas";
import { kvInstance } from "@/api/client";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: StudyApplyValues;
};

type UserInfo = {
  studentId: string;
  name: string;
  department: string;
  phone: string;
};

type Props = {
  params: Promise<{ study_id: string }>;
};

export default function StudyApplyPage({ params }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [currentStudy, setCurrentStudy] = useState<Study | null>(null);
  const [studyOptions, setStudyOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Unwrap params promise
        const { study_id } = await params;

        // Fetch user info
        const userResponse = await kvInstance
          .get("api/v1/user/me")
          .json<{ success: boolean; data: UserInfo; error: string | null }>();

        if (userResponse.success && userResponse.data) {
          setUserInfo(userResponse.data);
        }

        // Fetch current study
        const studyResponse = await kvInstance
          .get(`api/v2/studies/${study_id}`)
          .json<{ success: boolean; data: Study; error: string | null }>();

        if (studyResponse.success && studyResponse.data) {
          setCurrentStudy(studyResponse.data);
        }

        // Fetch all available studies for secondary selection
        const studiesResponse = await kvInstance
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
          }>();

        if (studiesResponse.success && studiesResponse.data?.studies) {
          const options = studiesResponse.data.studies
            .filter((study) => study.id !== parseInt(study_id))
            .map((study) => ({
              value: String(study.id),
              label: study.study_name,
            }));
          setStudyOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        router.push("/study/list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params, router]);

  const handleNext = () => {
    setStep(2);
  };

  const handleCancel = () => {
    router.push("/study/list");
  };

  const handleSubmit = async (
    _: ActionState,
    formData: FormData,
  ): Promise<ActionState> => {
    if (!currentStudy) {
      return {
        values: {
          primaryStudyId: 0,
          primaryStudyApplyReason: "",
          secondaryStudyId: null,
          secondaryStudyApplyReason: null,
        },
        errors: { root: { message: "스터디 정보를 찾을 수 없습니다." } },
      };
    }

    console.log("Form submitted", formData);
    return {
      values: {
        primaryStudyId: currentStudy.id,
        primaryStudyApplyReason: "",
        secondaryStudyId: null,
        secondaryStudyApplyReason: null,
      },
      errors: {},
    };
  };

  if (isLoading || !currentStudy || !userInfo) {
    return (
      <div className="mx-auto mb-16 mt-8 flex max-w-[1200px] items-center justify-center">
        <div className="text-text-subtle">로딩 중...</div>
      </div>
    );
  }

  const badgeTags = [
    {
      label: currentStudy.recruit_status === "APPLICABLE" ? "신청중" : "마감",
      variant:
        currentStudy.recruit_status === "APPLICABLE"
          ? ("primary" as const)
          : ("disabled" as const),
    },
    ...currentStudy.tags.slice(0, 2).map((tag) => ({
      label: tag,
      variant: "danger" as const,
    })),
  ];

  if (step === 1) {
    return (
      <StudyApplyInfoStep
        studyName={currentStudy.study_name}
        tags={badgeTags}
        userInfo={userInfo}
        onNext={handleNext}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <StudyApplyReasonStep
      action={handleSubmit}
      studyOptions={studyOptions}
      currentStudy={currentStudy}
    />
  );
}
