import { SuccessFillIcon } from "@repo/assets/icons/krds";
import { formatStaffRecruitmentDepartment, formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { Button } from "@ui/components/client";

interface StaffApplicationCompleteProps {
  recruitment: StaffRecruitmentRound;
  submission: {
    submittedAt: string;
    firstDepartment: string;
    secondDepartment: string | null;
  };
  onGoToApplication: () => void;
  onGoToRecruitment: () => void;
}

export function StaffApplicationComplete({
  recruitment,
  submission,
  onGoToApplication,
  onGoToRecruitment,
}: StaffApplicationCompleteProps) {
  const submittedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(submission.submittedAt));

  return (
    <div className="mx-auto flex w-full max-w-[792px] flex-col items-center gap-8 pb-16 pt-10">
      <div className="flex flex-col items-center gap-[21px]">
        <SuccessFillIcon
          width={116}
          height={116}
          backgroundColor="var(--color-primary-50)"
        />
        <h1 className="text-center text-[28px] font-bold leading-[1.5] sm:text-[40px]">
          <span className="text-text-primary">
            {formatStaffRecruitmentTitle(recruitment.act_year, recruitment.act_semester)}
          </span>
          <br />
          <span className="text-text-bolder">운영진 지원이 완료되었습니다.</span>
        </h1>
      </div>

      <p className="text-text-subtle -mt-6 text-center text-[17px] leading-[1.5]">
        제출한 지원서는 마이페이지에서 확인할 수 있습니다.
      </p>

      <section className="bg-surface-gray-subtle w-full rounded-xl p-5 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex gap-3">
            <p className="text-text-bolder w-[112px] shrink-0 text-[15px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
              지원 부서
            </p>
            <div className="text-text-basic flex min-w-0 flex-col gap-2 break-words text-[15px] leading-[1.5] sm:gap-4 sm:text-[19px]">
              <p>
                1지망 {formatStaffRecruitmentDepartment(submission.firstDepartment)}
              </p>
              <p>
                2지망 {submission.secondDepartment
                  ? formatStaffRecruitmentDepartment(submission.secondDepartment)
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <p className="text-text-bolder w-[112px] shrink-0 text-[15px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
              제출일
            </p>
            <p className="text-text-basic text-[15px] leading-[1.5] sm:text-[19px]">
              {submittedDate}
            </p>
          </div>
        </div>
      </section>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Button
          variant="secondary"
          size="large"
          onClick={onGoToRecruitment}
          className="h-14 w-full sm:h-16 sm:w-auto"
        >
          운영진 모집
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={onGoToApplication}
          className="h-14 w-full sm:h-16 sm:w-auto"
        >
          지원서 확인
        </Button>
      </div>
    </div>
  );
}
