"use client";
import { useCallback, useRef, useState } from "react";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PassDepartmentOption } from "./interview-board";

interface PendingPick {
  applicantName: string;
  options: PassDepartmentOption[];
  resolve: (departmentId: number | null | undefined) => void;
}

/**
 * 합격 부서 고르기. 지망이 둘이면 창을 띄워 고르게 하고, 하나 이하면 묻지 않는다.
 *
 * `pick`은 고른 부서 id를 돌려준다. 지망이 하나 이하면 그 부서(없으면 null)를 바로 돌려주고,
 * 창을 닫아 취소하면 undefined를 돌려준다. 면접 보드와 지원서 보기가 같이 쓴다.
 */
export function usePassDepartmentPicker() {
  const [pending, setPending] = useState<PendingPick | null>(null);
  const pendingRef = useRef<PendingPick | null>(null);

  const finish = useCallback((departmentId: number | null | undefined) => {
    const current = pendingRef.current;
    pendingRef.current = null;
    setPending(null);
    current?.resolve(departmentId);
  }, []);

  const pick = useCallback(
    (applicantName: string, options: PassDepartmentOption[]) =>
      new Promise<number | null | undefined>((resolve) => {
        if (options.length <= 1) {
          resolve(options[0]?.department_id ?? null);
          return;
        }
        // 앞의 창이 열려 있으면 취소로 닫고 새로 연다.
        pendingRef.current?.resolve(undefined);
        const next = { applicantName, options, resolve };
        pendingRef.current = next;
        setPending(next);
      }),
    [],
  );

  const dialog = (
    <Dialog open={pending !== null} onOpenChange={(open) => !open && finish(undefined)}>
      <DialogContent className="max-w-sm">
        {pending && (
          <>
            <DialogHeader>
              <DialogTitle>합격 부서 선택</DialogTitle>
              <DialogDescription>
                {pending.applicantName}님을 어느 부서로 합격시킬지 골라 주세요. 운영진 명단에 이 부서로 등록됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {pending.options.map((option) => (
                <Button
                  key={option.department_id}
                  variant="outline"
                  className="h-auto justify-start py-3"
                  onClick={() => finish(option.department_id)}
                >
                  <span className="text-muted-foreground mr-2 text-xs">{option.priority}지망</span>
                  {formatStaffRecruitmentDepartment(option.department_name)}
                </Button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => finish(undefined)}>
                취소
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  return { pick, dialog };
}
