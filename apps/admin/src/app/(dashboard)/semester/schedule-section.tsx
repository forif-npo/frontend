"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CalendarClock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleApiError } from "@core/utils/api-client";
import {
  SEMESTER_PHASES,
  SEMESTER_PHASE_DESCRIPTIONS,
  SEMESTER_PHASE_LABELS,
  getSemesterSchedules,
  saveSemesterSchedules,
  type SavePhaseWindow,
  type SemesterPhase,
} from "@core/semester/schedule-api";

interface ScheduleSectionProps {
  actYear: number;
  actSemester: number;
  semesterLabel: string;
}

/** 화면에서는 "~까지"로 받고, 서버에는 반열림 구간으로 보낸다 */
interface PhaseForm {
  startsAt: string;
  /** 마지막으로 신청 가능한 날짜. 저장 시 +1일 해서 ends_at으로 변환 */
  endsOn: string;
}

const EMPTY: PhaseForm = { startsAt: "", endsOn: "" };

/** "2026-03-09T00:00:00" → "2026-03-08" (표시용, 반열림 종료의 전날) */
function toEndsOn(endsAt: string): string {
  const date = new Date(endsAt);
  date.setDate(date.getDate() - 1);
  return toDateInput(date);
}

/** "2026-03-08" → "2026-03-09T00:00:00" (저장용, 다음 날 0시) */
function toEndsAt(endsOn: string): string {
  const date = new Date(`${endsOn}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return `${toDateInput(date)}T00:00:00`;
}

function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ScheduleSection({
  actYear,
  actSemester,
  semesterLabel,
}: ScheduleSectionProps) {
  const [forms, setForms] = useState<Record<SemesterPhase, PhaseForm>>({
    MENTOR_RECRUIT: EMPTY,
    MENTOR_REVIEW: EMPTY,
    MENTEE_RECRUIT: EMPTY,
    MENTEE_REVIEW: EMPTY,
    STUDY_START: EMPTY,
  });
  const [openPhases, setOpenPhases] = useState<Set<SemesterPhase>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await getSemesterSchedules(actYear, actSemester);
      const next: Record<SemesterPhase, PhaseForm> = {
        MENTOR_RECRUIT: EMPTY,
        MENTOR_REVIEW: EMPTY,
        MENTEE_RECRUIT: EMPTY,
        MENTEE_REVIEW: EMPTY,
        STUDY_START: EMPTY,
      };
      const open = new Set<SemesterPhase>();

      items.forEach((item) => {
        next[item.phase] = {
          startsAt: item.starts_at.slice(0, 10),
          endsOn: toEndsOn(item.ends_at),
        };
        if (item.open) open.add(item.phase);
      });

      setForms(next);
      setOpenPhases(open);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [actYear, actSemester]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const update = (phase: SemesterPhase, patch: Partial<PhaseForm>) => {
    setForms((prev) => ({ ...prev, [phase]: { ...prev[phase], ...patch } }));
  };

  const handleSave = async () => {
    if (isSubmitting) return;

    const phases: SavePhaseWindow[] = [];
    for (const phase of SEMESTER_PHASES) {
      const form = forms[phase];
      if (phase === "STUDY_START") {
        if (form.startsAt) {
          phases.push({
            phase,
            starts_at: `${form.startsAt}T00:00:00`,
            // API는 모든 일정을 반열림 구간으로 보관한다. 시작일만 의미하므로 다음 날을 종료 시각으로 둔다.
            ends_at: toEndsAt(form.startsAt),
          });
        }
        continue;
      }
      const filled = Boolean(form.startsAt) && Boolean(form.endsOn);

      // 한쪽만 채운 단계는 저장할 수 없다. 비우려면 둘 다 지운다.
      if (!filled && (form.startsAt || form.endsOn)) {
        toast.error(
          `${SEMESTER_PHASE_LABELS[phase]}의 시작일과 종료일을 모두 입력하거나 모두 비워주세요.`,
        );
        return;
      }
      if (filled) {
        phases.push({
          phase,
          starts_at: `${form.startsAt}T00:00:00`,
          ends_at: toEndsAt(form.endsOn),
        });
      }
    }

    setIsSubmitting(true);
    try {
      await saveSemesterSchedules(actYear, actSemester, phases);
      toast.success(
        phases.length === 0
          ? "학기 일정을 모두 비웠습니다. 멘티 모집과 멘티 합불 처리는 닫히고, 스터디는 자동 개설되지 않습니다."
          : `${semesterLabel} 학기 일정을 저장했습니다.`,
      );
      await fetchSchedules();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const configuredCount = SEMESTER_PHASES.filter((phase) =>
    phase === "STUDY_START"
      ? Boolean(forms[phase].startsAt)
      : Boolean(forms[phase].startsAt) && Boolean(forms[phase].endsOn),
  ).length;

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-6">
      <div className="flex items-center gap-2">
        <CalendarClock className="text-muted-foreground h-5 w-5" />
        <span className="text-muted-foreground text-sm">
          {semesterLabel} 학기 일정
        </span>
      </div>

      {!isLoading && configuredCount === 0 && (
        <div className="rounded-md bg-amber-50 p-3 text-amber-900">
          <p className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0" />이 학기 일정이
            설정되지 않았습니다
          </p>
          <p className="mt-1 text-xs">
            일정을 비워두면 개설 신청은 상시 가능합니다. 멘티 수강 신청과 멘티
            합불 처리는 각각의 일정을 설정해야만 열리며, 스터디 시작일이 없으면
            승인된 스터디가 자동 개설되지 않습니다.
          </p>
        </div>
      )}

      <p className="text-muted-foreground text-xs">
        모집 단계는 앞 단계가 끝난 뒤에 시작해야 하며 겹칠 수 없습니다.
        종료일까지 포함해서 신청을 받습니다. 스터디 시작일 0시에 승인된 스터디가
        개설 상태로 전환됩니다.
      </p>

      <div className="flex flex-col gap-3">
        {SEMESTER_PHASES.map((phase) => {
          const form = forms[phase];
          const isOpen = openPhases.has(phase);
          const isStudyStart = phase === "STUDY_START";

          return (
            <div key={phase} className="rounded-md border p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {SEMESTER_PHASE_LABELS[phase]}
                    {isOpen && (
                      <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                        <Check className="h-3 w-3" />
                        진행 중
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {SEMESTER_PHASE_DESCRIPTIONS[phase]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${phase}-start`} className="text-xs">
                    시작일
                  </Label>
                  <Input
                    id={`${phase}-start`}
                    type="date"
                    className="w-[170px]"
                    value={form.startsAt}
                    onChange={(e) =>
                      update(phase, { startsAt: e.target.value })
                    }
                    disabled={isLoading || isSubmitting}
                  />
                </div>
                {!isStudyStart && (
                  <>
                    <span className="pb-2 text-sm">~</span>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`${phase}-end`} className="text-xs">
                        종료일 (이 날까지 가능)
                      </Label>
                      <Input
                        id={`${phase}-end`}
                        type="date"
                        className="w-[170px]"
                        value={form.endsOn}
                        onChange={(e) =>
                          update(phase, { endsOn: e.target.value })
                        }
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                  </>
                )}
                {(form.startsAt || form.endsOn) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => update(phase, EMPTY)}
                    disabled={isSubmitting}
                  >
                    비우기
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isLoading || isSubmitting}>
          {isSubmitting ? "저장 중..." : "학기 일정 저장"}
        </Button>
        <span className="text-muted-foreground text-xs">
          {configuredCount}/5개 일정 설정됨
        </span>
      </div>
    </div>
  );
}
