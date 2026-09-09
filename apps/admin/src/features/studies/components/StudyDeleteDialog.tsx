"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Study } from "../types";

interface StudyDeleteDialogProps {
  target: Study | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function StudyDeleteDialog({
  target,
  onOpenChange,
  onConfirm,
  isDeleting,
}: StudyDeleteDialogProps) {
  const hasApplications = target?.has_applications === true;

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasApplications ? "스터디 삭제 불가" : "스터디 정보 삭제"}
          </DialogTitle>
          <DialogDescription>
            {hasApplications
              ? `${target?.study_name ?? "선택한 스터디"}에는 신청 내역이 있어 삭제할 수 없습니다.`
              : `${target?.study_name ?? "선택한 스터디"}를 삭제합니다. 삭제 후에는 복구할 수 없습니다.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            {hasApplications ? "확인" : "취소"}
          </Button>
          {!hasApplications && (
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => onConfirm()}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              삭제
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
