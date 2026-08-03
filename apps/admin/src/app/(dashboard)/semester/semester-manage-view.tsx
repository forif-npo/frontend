"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CalendarRange, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleApiError } from "@core/utils/api-client";
import {
  changeCurrentSemester,
  getCurrentSemester,
  getSemesterChangePreview,
  getSemesters,
  type Semester,
  type SemesterChangePreview,
} from "@core/semester/api";
import { getAdminCandidates, type AdminCandidate } from "./api";

function parseLabel(label: string): { year: number; semester: number } | null {
  const [yy, s] = label.split("-");
  if (!yy || !s) return null;
  return { year: 2000 + Number(yy), semester: Number(s) };
}

interface SemesterManageViewProps {
  /** 로그인한 회장단 본인의 학번. 연임 시 차기 회장 기본값이 된다. */
  currentUserId: number;
  currentUserName: string;
}

export function SemesterManageView({
  currentUserId,
  currentUserName,
}: SemesterManageViewProps) {
  const [current, setCurrent] = useState<Semester | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [preview, setPreview] = useState<SemesterChangePreview | null>(null);
  const [nextPresidentId, setNextPresidentId] = useState<string>("");

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [active, list, admins] = await Promise.all([
        getCurrentSemester(),
        getSemesters(),
        getAdminCandidates().catch(() => [] as AdminCandidate[]),
      ]);
      setCurrent(active);
      setSemesters(list);
      setCandidates(admins);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /** 다음 학기 = 서버 목록에서 현재보다 한 칸 위 */
  const nextSemester = (): Semester | null => {
    if (!current) return null;
    const idx = semesters.findIndex((s) => s.label === current.label);
    return idx > 0 ? (semesters[idx - 1] ?? null) : null;
  };

  const openPreview = async (target: Semester) => {
    setIsSubmitting(true);
    try {
      const result = await getSemesterChangePreview(
        target.act_year,
        target.act_semester,
      );
      setPreview(result);
      // 기본값은 연임. 회장이 바뀌는 경우에만 다른 사람을 고르게 한다.
      setNextPresidentId(String(currentUserId));
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview || isSubmitting) return;
    if (!nextPresidentId) {
      toast.error("차기 회장을 지정해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const changed = await changeCurrentSemester({
        act_year: preview.target.act_year,
        act_semester: preview.target.act_semester,
        next_president_user_id: Number(nextPresidentId),
      });
      const isReelection = Number(nextPresidentId) === currentUserId;
      toast.success(
        isReelection
          ? `활동 학기를 ${changed.label}로 전환했습니다.`
          : `활동 학기를 ${changed.label}로 전환하고 회장 권한을 넘겼습니다.`,
      );
      setPreview(null);
      setSelectedLabel("");
      await fetchAll();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = nextSemester();

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="학기 관리"
        description="동아리의 활동 학기를 지정합니다. 새로 등록되는 스터디 개설·수강 신청이 이 학기로 기록되고, 목록과 마이페이지의 현재 학기 판정이 바뀝니다."
      />

      {/* 현재 학기 */}
      <div className="flex flex-col gap-4 rounded-lg border p-6">
        <div className="flex items-center gap-2">
          <CalendarRange className="text-muted-foreground h-5 w-5" />
          <span className="text-muted-foreground text-sm">현재 활동 학기</span>
        </div>
        <p className="text-3xl font-bold">
          {isLoading ? "불러오는 중..." : (current?.label ?? "-")}
        </p>

        <div className="flex flex-wrap items-end gap-3 pt-2">
          {next && (
            <Button onClick={() => openPreview(next)} disabled={isSubmitting}>
              다음 학기({next.label})로 전환
            </Button>
          )}

          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="semester-select" className="text-xs">
                직접 선택
              </Label>
              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger id="semester-select" className="w-[160px]">
                  <SelectValue placeholder="학기 선택" />
                </SelectTrigger>
                <SelectContent>
                  {semesters
                    .filter((s) => s.label !== current?.label)
                    .map((s) => (
                      <SelectItem key={s.label} value={s.label}>
                        {s.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              disabled={!selectedLabel || isSubmitting}
              onClick={() => {
                const parsed = parseLabel(selectedLabel);
                if (!parsed) return;
                openPreview({
                  act_year: parsed.year,
                  act_semester: parsed.semester,
                  label: selectedLabel,
                });
              }}
            >
              전환
            </Button>
          </div>
        </div>
      </div>

      {/* 전환 확인 다이얼로그 */}
      <Dialog
        open={preview !== null}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="sm:max-w-[520px]">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {preview.current.label} → {preview.target.label} 전환
                </DialogTitle>
                <DialogDescription>
                  전환 후 새로 생성되는 데이터가 {preview.target.label}로
                  기록됩니다. 이미 저장된 스터디·신청서는 영향받지 않습니다.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 text-sm">
                {/* 차기 회장 */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="next-president">차기 회장</Label>
                  <Select
                    value={nextPresidentId}
                    onValueChange={setNextPresidentId}
                  >
                    <SelectTrigger id="next-president" className="w-full">
                      <SelectValue placeholder="차기 회장 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((admin) => (
                        <SelectItem
                          key={admin.user_id}
                          value={String(admin.user_id)}
                        >
                          {admin.name} ({admin.user_id})
                          {admin.user_id === currentUserId ? " — 본인" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    {Number(nextPresidentId) === currentUserId
                      ? `${currentUserName || "본인"} 님이 다음 학기 회장을 맡습니다.`
                      : "전환과 동시에 회장 권한이 넘어갑니다. 이후 운영진 계정 생성·명단 관리는 신임 회장이 맡고, 본인은 일반 운영진이 됩니다."}
                  </p>
                </div>

                {/* 수료증 */}
                {preview.has_pending_certificates && (
                  <div className="rounded-md bg-amber-50 p-3 text-amber-900">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {preview.current.label} 수료증이 아직 다 나가지 않았습니다
                    </p>
                    <p className="mt-1 text-xs">
                      수강생 {preview.current_member_count}명 중{" "}
                      {preview.current_certificate_issued_count}명 발급 완료.
                      전환 후 발급하면 신임 회장 서명이 찍히므로, 남은 수료증은
                      전환 전에 발급하는 편이 좋습니다.
                    </p>
                  </div>
                )}

                {/* 운영진 명단 */}
                {preview.needs_team_setup ? (
                  <div className="rounded-md bg-amber-50 p-3 text-amber-900">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {preview.target.label} 운영진이 아직 없습니다
                    </p>
                    <p className="mt-1 text-xs">
                      전환 후{" "}
                      <span className="font-medium">회원 관리 &gt; 운영진</span>
                      에서 이번 학기 운영진을 지정해주세요. 지정 전까지 홈페이지
                      운영진 소개 페이지가 비어 있습니다.
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {preview.target.label} 운영진{" "}
                    {preview.target_team_member_count}명이 이미 지정되어
                    있습니다.
                  </p>
                )}

                {/* 해커톤 */}
                {!preview.target_hackathon_exists && (
                  <div className="bg-muted rounded-md p-3">
                    <p className="font-semibold">
                      {preview.target.label} 해커톤이 아직 없습니다
                    </p>
                    <p className="text-muted-foreground text-xs">
                      해커톤을 진행한다면 전환 후 해커톤 메뉴에서 새로
                      만들어주세요. 수료증 발급 자격 판정에도 사용됩니다.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setPreview(null)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isSubmitting || !nextPresidentId}
                >
                  {isSubmitting ? "전환 중..." : "전환하기"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
