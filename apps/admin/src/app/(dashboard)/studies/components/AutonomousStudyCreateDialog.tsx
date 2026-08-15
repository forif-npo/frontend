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

interface AutonomousStudyCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isCreating: boolean;
}

export function AutonomousStudyCreateDialog({
  open,
  onOpenChange,
  onConfirm,
  isCreating,
}: AutonomousStudyCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>자율스터디 개설</DialogTitle>
          <DialogDescription>
            현재 활동 학기에 자율스터디를 즉시 개설하고, 개설한 운영진을 대표
            멘토로 지정합니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isCreating}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button type="button" disabled={isCreating} onClick={onConfirm}>
            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
            개설
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
