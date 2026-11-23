"use client";
import { useEffect, useState } from "react";
import type { StaffInterviewSheet } from "@core/types/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toast";
import { changeStaffInterviewStatus, getStaffInterviewSheet } from "./api";
import { formatInterviewSlot, interviewStatusTitle, passDepartmentOptions } from "./interview-board";
import { usePassDepartmentPicker } from "./PassDepartmentDialog";

/**
 * 지원서 하단에 면접 배정시각과 결과를 표시하고, 마감된 모집에서는 합격·불합격을 정한다.
 *
 * 합격·불합격은 회장단만, 마감된 모집에서만 정할 수 있다.
 */
export function StaffApplicationDecision({
  recruitmentId,
  applicationId,
  canDecide,
}: {
  recruitmentId: number;
  applicationId: number;
  canDecide: boolean;
}) {
  const [sheet, setSheet] = useState<StaffInterviewSheet | null>(null);
  const [busy, setBusy] = useState(false);
  const passPicker = usePassDepartmentPicker();

  useEffect(() => {
    let cancelled = false;
    setSheet(null);
    getStaffInterviewSheet(recruitmentId, applicationId)
      .then((next) => {
        if (!cancelled) {
          setSheet(next);
        }
      })
      // 열람자처럼 기록지를 읽을 수 없는 경우에도 지원서 하단의 항목은 표시한다.
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [recruitmentId, applicationId]);

  const decide = async (status: "PASSED" | "FAILED") => {
    if (!sheet || !canDecide || busy || sheet.results_finalized) return;
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

  const assignedTime =
    sheet?.assigned_slot && sheet.slot_minutes
      ? formatInterviewSlot(sheet.assigned_slot, sheet.slot_minutes)
      : "-";
  const result =
    sheet?.status === "PASSED"
      ? "합격"
      : sheet?.status === "FAILED"
        ? "불합격"
        : "-";

  return (
    <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">면접 배정시각</span>
        <span>{assignedTime}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">면접 결과</span>
        <span>{result}</span>
      </div>
      {canDecide && sheet && (
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy || sheet.results_finalized || sheet.status === "FAILED"}
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
      )}
      {passPicker.dialog}
    </div>
  );
}
