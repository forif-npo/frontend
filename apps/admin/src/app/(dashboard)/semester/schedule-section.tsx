"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CalendarClock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SEMESTER_PHASES,
  SEMESTER_PHASE_DESCRIPTIONS,
  SEMESTER_PHASE_LABELS,
  getSemesterSchedules,
  saveSemesterSchedules,
  type SavePhaseWindow,
  type SemesterPhase,
} from "@/features/semester/schedule-api";

interface ScheduleSectionProps {
  actYear: number;
  actSemester: number;
  semesterLabel: string;
}

interface PhaseForm {
  startDate: string;
  startHour: string;
  startMinute: string;
  endDate: string;
  endHour: string;
  endMinute: string;
}

const EMPTY: PhaseForm = {
  startDate: "",
  startHour: "",
  startMinute: "",
  endDate: "",
  endHour: "",
  endMinute: "",
};

const HOURS = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, minute) =>
  String(minute).padStart(2, "0"),
);

function toLocalDateTime(date: string, hour: string, minute: string): string {
  return `${date}T${hour}:${minute}:00`;
}

function addOneMinute(date: string, hour: string, minute: string): string {
  const value = new Date(toLocalDateTime(date, hour, minute));
  value.setMinutes(value.getMinutes() + 1);
  return formatLocalDateTime(value);
}

function formatLocalDateTime(value: Date): string {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  const h = String(value.getHours()).padStart(2, "0");
  const min = String(value.getMinutes()).padStart(2, "0");
  return toLocalDateTime(`${y}-${m}-${d}`, h, min);
}

/** API의 반열림 종료 시각을 화면용 마지막 가능 시각으로 바꾼다. */
function toInclusiveEnd(endsAt: string): string {
  const value = new Date(endsAt);
  value.setMinutes(value.getMinutes() - 1);
  return formatLocalDateTime(value);
}

function DateTimeInput({
  id,
  label,
  date,
  hour,
  minute,
  onDateChange,
  onHourChange,
  onMinuteChange,
  disabled,
}: {
  id: string;
  label: string;
  date: string;
  hour: string;
  minute: string;
  onDateChange: (value: string) => void;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`${id}-date`} className="text-xs">
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={`${id}-date`}
          type="date"
          className="w-[170px]"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          disabled={disabled}
        />
        <Select value={hour} onValueChange={onHourChange} disabled={disabled}>
          <SelectTrigger id={`${id}-hour`} className="w-[88px]">
            <SelectValue placeholder="시간" />
          </SelectTrigger>
          <SelectContent>
            {HOURS.map((value) => (
              <SelectItem key={value} value={value}>
                {value}시
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={minute}
          onValueChange={onMinuteChange}
          disabled={disabled}
        >
          <SelectTrigger id={`${id}-minute`} className="w-[88px]">
            <SelectValue placeholder="분" />
          </SelectTrigger>
          <SelectContent>
            {MINUTES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}분
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
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
        const inclusiveEnd = toInclusiveEnd(item.ends_at);
        next[item.phase] = {
          startDate: item.starts_at.slice(0, 10),
          startHour: item.starts_at.slice(11, 13),
          startMinute: item.starts_at.slice(14, 16),
          endDate: inclusiveEnd.slice(0, 10),
          endHour: inclusiveEnd.slice(11, 13),
          endMinute: inclusiveEnd.slice(14, 16),
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
        const filled =
          Boolean(form.startDate) &&
          Boolean(form.startHour) &&
          Boolean(form.startMinute);
        if (!filled && (form.startDate || form.startHour || form.startMinute)) {
          toast.error(
            `${SEMESTER_PHASE_LABELS[phase]}의 날짜와 시간을 모두 입력해주세요.`,
          );
          return;
        }
        if (filled) {
          phases.push({
            phase,
            starts_at: toLocalDateTime(
              form.startDate,
              form.startHour,
              form.startMinute,
            ),
            // API는 모든 일정을 반열림 구간으로 보관한다. 시작 시각만 의미하므로 1분 뒤를 종료 시각으로 둔다.
            ends_at: addOneMinute(
              form.startDate,
              form.startHour,
              form.startMinute,
            ),
          });
        }
        continue;
      }
      const filled =
        Boolean(form.startDate) &&
        Boolean(form.startHour) &&
        Boolean(form.startMinute) &&
        Boolean(form.endDate) &&
        Boolean(form.endHour) &&
        Boolean(form.endMinute);

      // 한쪽만 채운 단계는 저장할 수 없다. 비우려면 둘 다 지운다.
      if (
        !filled &&
        (form.startDate ||
          form.startHour ||
          form.startMinute ||
          form.endDate ||
          form.endHour ||
          form.endMinute)
      ) {
        toast.error(
          `${SEMESTER_PHASE_LABELS[phase]}의 시작·종료 날짜와 시간을 모두 입력하거나 모두 비워주세요.`,
        );
        return;
      }
      if (filled) {
        phases.push({
          phase,
          starts_at: toLocalDateTime(
            form.startDate,
            form.startHour,
            form.startMinute,
          ),
          ends_at: addOneMinute(form.endDate, form.endHour, form.endMinute),
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
      ? Boolean(forms[phase].startDate) &&
        Boolean(forms[phase].startHour) &&
        Boolean(forms[phase].startMinute)
      : Boolean(forms[phase].startDate) &&
        Boolean(forms[phase].startHour) &&
        Boolean(forms[phase].startMinute) &&
        Boolean(forms[phase].endDate) &&
        Boolean(forms[phase].endHour) &&
        Boolean(forms[phase].endMinute),
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
        <div className="bg-warning-5 text-text-warning rounded-md p-3">
          <p className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0" />이 학기 일정이
            설정되지 않았습니다
          </p>
          <p className="mt-1 text-xs">
            일정을 비워두면 개설 신청은 상시 가능합니다. 멘티 수강 신청과 멘티
            합불 처리는 각각의 일정을 설정해야만 열리며, 스터디 시작 시각이
            없으면 승인된 스터디가 자동 개설되지 않습니다.
          </p>
        </div>
      )}

      <p className="text-muted-foreground text-xs">
        모집 단계는 앞 단계가 끝난 뒤에 시작해야 하며 겹칠 수 없습니다. 시간은
        분 단위로 설정할 수 있으며, 종료 시각까지 신청을 받습니다. 스터디 시작
        시각에 승인된 스터디가 개설 상태로 전환됩니다.
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
                      <span className="bg-success-10 text-text-success flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium">
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
                <DateTimeInput
                  id={`${phase}-start`}
                  label="시작 일시"
                  date={form.startDate}
                  hour={form.startHour}
                  minute={form.startMinute}
                  onDateChange={(value) => update(phase, { startDate: value })}
                  onHourChange={(value) => update(phase, { startHour: value })}
                  onMinuteChange={(value) =>
                    update(phase, { startMinute: value })
                  }
                  disabled={isLoading || isSubmitting}
                />
                {!isStudyStart && (
                  <>
                    <span className="pb-2 text-sm">~</span>
                    <DateTimeInput
                      id={`${phase}-end`}
                      label="종료 일시 (이 시각까지 가능)"
                      date={form.endDate}
                      hour={form.endHour}
                      minute={form.endMinute}
                      onDateChange={(value) =>
                        update(phase, { endDate: value })
                      }
                      onHourChange={(value) =>
                        update(phase, { endHour: value })
                      }
                      onMinuteChange={(value) =>
                        update(phase, { endMinute: value })
                      }
                      disabled={isLoading || isSubmitting}
                    />
                  </>
                )}
                {(form.startDate ||
                  form.startHour ||
                  form.startMinute ||
                  form.endDate ||
                  form.endHour ||
                  form.endMinute) && (
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
