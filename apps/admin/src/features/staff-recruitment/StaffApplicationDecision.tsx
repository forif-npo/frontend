"use client";
import { useEffect, useState } from "react";
import type { StaffInterviewSheet,StaffInterviewStatus } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toast";
import { changeStaffInterviewStatus, getStaffInterviewSheet } from "./api";
import { interviewStatusTitle, passDepartmentOptions } from "./interview-board";
import { usePassDepartmentPicker } from "./PassDepartmentDialog";

/**
 * 지원서 보기에서 바로 합격·불합격을 정한다. 면접 보드와 같은 면접 상태를 쓴다.
 *
 * 합격·불합격은 회장단만, 마감된 모집에서만 정할 수 있다. 열람자처럼 권한이 없는 계정은
 * 기록지 조회가 거절되므로 이 영역을 아예 보여 주지 않는다.
 */
export function StaffApplicationDecision({
  recruitmentId,
  applicationId,
}: {
  recruitmentId: number;
  applicationId: number;
}) {
  const [sheet, setSheet] = useState<StaffInterviewSheet | null>(null);
  const [busy, setBusy] = useState(false);
  const passPicker = usePassDepartmentPicker();

  useEffect(() => {
    let cancelled = false;
    setSheet(null);
    getStaffInterviewSheet(recruitmentId, applicationId)
      .then((next) => {
        if (!cancelled) setSheet(next);
      })
      // 권한이 없거나 기록을 읽을 수 없으면 조용히 숨긴다. 지원서 보기 자체는 그대로 쓸 수 있다.
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [recruitmentId, applicationId]);

  if (!sheet) return null;

  const decide = async (status: StaffInterviewStatus) => {
    if (busy || sheet.results_finalized) return;
    let departmentId: number | null = null;
    if (status === "PASSED") {
      const picked = await passPicker.pick(
        sheet.applicant_name,
        passDepartmentOptions(sheet),
      );
      if (picked === undefined) return;
      departmentId = picked;
    }
    setBusy(true);
    try {
      const next = await changeStaffInterviewStatus(
        recruitmentId,
        applicationId,
        status,
        departmentId,
      );
      setSheet(next);
      toast.success(
        `${next.applicant_name}님을 ${interviewStatusTitle(next.status)} 처리했습니다.`,
      );
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">면접 결과</span>
      <Badge variant="outline">
        {interviewStatusTitle(sheet.status)}
        {sheet.passed_department &&
          ` · ${formatStaffRecruitmentDepartment(sheet.passed_department.department_name)}`}
      </Badge>
      <div className="ml-auto flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={
            busy || sheet.results_finalized || sheet.status === "FAILED"
          }
          onClick={() => void decide("FAILED")}
        >
          불합격
        </Button>
        <Button
          type="button"
          disabled={busy || sheet.results_finalized}
          onClick={() => void decide("PASSED")}
        >
          합격
        </Button>
      </div>
      {passPicker.dialog}
    </div>
  );
}
