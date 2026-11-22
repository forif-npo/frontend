"use client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleApiError } from "@core/utils/api-client";
import { getCurrentSemester, type Semester } from "@/features/semester/api";
import { addOperator } from "./api";

interface AddOperatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => Promise<void> | void;
  targetSemesterLabel: string;
  isIncumbentPresident: boolean;
}

const EMPTY_FORM = { userId: "", clubDepartment: "", userTitle: "" };

export function AddOperatorDialog({
  open,
  onOpenChange,
  onAdded,
  targetSemesterLabel,
  isIncumbentPresident,
}: AddOperatorDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const blockedLeadershipTitle =
    !isIncumbentPresident && ["회장", "부회장"].includes(form.userTitle.trim());

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    const match = targetSemesterLabel.match(/^(\d{2})-(1|2)$/);
    if (match) {
      setSemester({
        act_year: 2000 + Number(match[1]),
        act_semester: Number(match[2]),
        label: targetSemesterLabel,
      });
      return;
    }
    getCurrentSemester()
      .then(setSemester)
      .catch(() => setSemester(null));
  }, [open, targetSemesterLabel]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (blockedLeadershipTitle) return;

    const userId = Number(form.userId);
    if (!form.userId || Number.isNaN(userId)) {
      toast.error("학번을 숫자로 입력해주세요.");
      return;
    }
    if (!form.clubDepartment.trim()) {
      toast.error("소속 팀을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addOperator({
        user_id: userId,
        act_year: semester?.act_year,
        act_semester: semester?.act_semester,
        club_department: form.clubDepartment.trim(),
        user_title: form.userTitle.trim() || undefined,
      });
      toast.success(
        `${semester?.label ?? "현재 학기"} 운영진으로 추가되었습니다.`,
      );
      onOpenChange(false);
      await onAdded();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>운영진 추가</DialogTitle>
          <DialogDescription>
            {semester?.label ?? "현재 활동 학기"} 운영진 명단에 추가합니다. 이
            명단은 홈페이지 운영진 소개에 표시되며, 학기가 바뀌면 이어지지
            않으므로 매 학기 새로 지정해야 합니다. 다음 학기 회장·부회장 직책은
            현 회장만 지정할 수 있으며, 운영진 계정이 있는 사람에게 지정 즉시
            해당 권한이 열립니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="operator-user-id">학번</Label>
            <Input
              id="operator-user-id"
              value={form.userId}
              placeholder="예: 2024111111"
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="operator-department">소속 팀</Label>
            <Input
              id="operator-department"
              value={form.clubDepartment}
              placeholder="예: SW팀, 기획팀"
              onChange={(e) =>
                setForm({ ...form, clubDepartment: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="operator-title">직책 (선택)</Label>
            <Input
              id="operator-title"
              value={form.userTitle}
              placeholder="예: 회장, 부회장, 팀장"
              onChange={(e) => setForm({ ...form, userTitle: e.target.value })}
            />
            <p className="text-muted-foreground text-xs">
              차기 회장단 권한은 직책을 정확히 회장 또는 부회장으로 지정하면
              열립니다. 계정 목록에는 차기 회장·차기 부회장으로 표시됩니다.
            </p>
            {blockedLeadershipTitle && (
              <p className="text-muted-foreground text-xs">
                회장·부회장 직책은 현 회장만 지정할 수 있습니다.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || blockedLeadershipTitle}
          >
            {isSubmitting ? "추가 중..." : "추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
