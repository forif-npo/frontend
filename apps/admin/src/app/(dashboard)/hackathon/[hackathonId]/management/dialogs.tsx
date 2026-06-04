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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Criterion, Team } from "@core/types/hackathon";
import { Loader2 } from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { AwardForm, CriterionForm } from "./types";

export function CriterionDialog({
  open,
  onOpenChange,
  isEdit,
  form,
  setForm,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  form: CriterionForm;
  setForm: Dispatch<SetStateAction<CriterionForm>>;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "평가 기준 수정" : "평가 기준 추가"}
          </DialogTitle>
          <DialogDescription>
            심사에 사용할 평가 기준 항목을 설정합니다.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="criterion-name">이름</Label>
            <Input
              id="criterion-name"
              value={form.name}
              disabled={submitting}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="criterion-desc">설명</Label>
            <Textarea
              id="criterion-desc"
              value={form.description}
              disabled={submitting}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="criterion-max">만점</Label>
              <Input
                id="criterion-max"
                type="number"
                min={1}
                value={form.max_score}
                disabled={submitting}
                onChange={(e) =>
                  setForm((p) => ({ ...p, max_score: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criterion-weight">가중치</Label>
              <Input
                id="criterion-weight"
                type="number"
                step="0.1"
                value={form.weight}
                disabled={submitting}
                onChange={(e) =>
                  setForm((p) => ({ ...p, weight: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criterion-order">표시 순서</Label>
              <Input
                id="criterion-order"
                type="number"
                min={1}
                value={form.display_order}
                disabled={submitting}
                onChange={(e) =>
                  setForm((p) => ({ ...p, display_order: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "저장" : "추가"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ScoringDialog({
  team,
  criteria,
  scores,
  setScores,
  submitting,
  onClose,
  onSubmit,
}: {
  team: Team | null;
  criteria: Criterion[];
  scores: Record<number, string>;
  setScores: Dispatch<SetStateAction<Record<number, string>>>;
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog
      open={team !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>심사 점수 입력</DialogTitle>
          <DialogDescription>
            {team?.name} 팀의 평가 점수를 입력합니다.
          </DialogDescription>
        </DialogHeader>

        {criteria.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            먼저 평가 기준을 등록해주세요.
          </p>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {criteria.map((criterion) => (
              <div key={criterion.criterion_id} className="space-y-2">
                <Label htmlFor={`score-${criterion.criterion_id}`}>
                  {criterion.name}{" "}
                  <span className="text-muted-foreground">
                    (1~{criterion.max_score})
                  </span>
                </Label>
                <Input
                  id={`score-${criterion.criterion_id}`}
                  type="number"
                  min={1}
                  max={criterion.max_score}
                  value={scores[criterion.criterion_id] ?? ""}
                  disabled={submitting}
                  onChange={(e) =>
                    setScores((p) => ({
                      ...p,
                      [criterion.criterion_id]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={onClose}
              >
                취소
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                제출
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AwardDialog({
  open,
  onOpenChange,
  isEdit,
  form,
  setForm,
  teams,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  form: AwardForm;
  setForm: Dispatch<SetStateAction<AwardForm>>;
  teams: Team[];
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "수상 수정" : "수상 등록"}</DialogTitle>
          <DialogDescription>수상 팀과 상명을 등록합니다.</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-2">
            <Label>수상 팀</Label>
            <Select
              value={form.hackathon_team_id}
              disabled={submitting}
              onValueChange={(value) =>
                setForm((p) => ({ ...p, hackathon_team_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="팀 선택" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem
                    key={team.hackathon_team_id}
                    value={String(team.hackathon_team_id)}
                  >
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="award-name">상명</Label>
            <Input
              id="award-name"
              value={form.award_name}
              disabled={submitting}
              placeholder="예: 대상"
              onChange={(e) =>
                setForm((p) => ({ ...p, award_name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="award-rank">순위 (선택)</Label>
            <Input
              id="award-rank"
              type="number"
              min={1}
              value={form.award_rank}
              disabled={submitting}
              onChange={(e) =>
                setForm((p) => ({ ...p, award_rank: e.target.value }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "저장" : "등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  submitting,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  submitting: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
