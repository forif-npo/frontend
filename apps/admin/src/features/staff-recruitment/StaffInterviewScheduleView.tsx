"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TimeSlotGrid } from "@ui/components/client";
import type { StaffInterviewSchedule, StaffInterviewScheduleApplicant, StaffInterviewSlot } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import { availableApplicantsBySlot, hasNoOverlap, interviewSlotStarts, toInterviewSlotKeys, toInterviewSlotRequest } from "@core/staff-interview";
import { formatSlotDate, formatSlotRange, parseTimeSlotKey, timeSlotKey } from "@core/time-slot";
import { handleApiError } from "@core/utils/api-client";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/Toast";
import { assignStaffInterview, confirmStaffInterviewSchedule, getStaffInterviewSchedule, getStaffRecruitments, saveStaffInterviewHostSlots, unassignStaffInterview } from "./api";

function formatDate(date: string): string {
  const { label, weekday } = formatSlotDate(date);
  return `${label}(${weekday})`;
}

function formatSlot(slot: StaffInterviewSlot, slotMinutes: number): string {
  return `${formatDate(slot.date)} ${formatSlotRange(slot.start_minute, slotMinutes)}`;
}

function departmentsOf(applicant: StaffInterviewScheduleApplicant) {
  const byPriority = (priority: number) =>
    applicant.applied_departments.find((department) => department.priority === priority)?.name ?? "-";
  return { first: byPriority(1), second: byPriority(2) };
}

/**
 * 면접 일정 조율.
 *
 * 회장단이 면접을 볼 수 있는 시간을 칠하면, 칸마다 그 시간에 되는 지원자를 보여 준다.
 * 누구를 어느 칸에 넣을지는 회장단이 정한다. 면접은 한 타임에 한 명이다.
 * 시간이 맞지 않는 지원자는 표에서 아무 빈 칸에나 직접 넣는다.
 */
export function StaffInterviewScheduleView({ recruitmentId }: { recruitmentId: number }) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<StaffInterviewSchedule | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hostDraft, setHostDraft] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const apply = useCallback((next: StaffInterviewSchedule) => {
    setSchedule(next);
    setHostDraft(toInterviewSlotKeys(next.host_slots));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [loaded, rounds] = await Promise.all([
          getStaffInterviewSchedule(recruitmentId),
          getStaffRecruitments(),
        ]);
        if (cancelled) return;
        apply(loaded);
        const round = rounds.find((item) => item.recruitment_id === recruitmentId);
        setTitle(round ? formatStaffRecruitmentTitle(round.act_year, round.act_semester) : null);
      } catch (error) {
        if (!cancelled) setLoadError(await handleApiError(error));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recruitmentId, apply]);

  const run = async (action: () => Promise<StaffInterviewSchedule>, success?: string) => {
    if (busy) return false;
    setBusy(true);
    try {
      apply(await action());
      if (success) toast.success(success);
      return true;
    } catch (error) {
      toast.error(await handleApiError(error));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const savedHostKeys = useMemo(
    () => (schedule ? toInterviewSlotKeys(schedule.host_slots) : new Set<string>()),
    [schedule],
  );
  const hostDirty =
    hostDraft.size !== savedHostKeys.size ||
    Array.from(hostDraft).some((key) => !savedHostKeys.has(key));

  if (loadError) {
    return <div className="text-muted-foreground p-8 text-center">{loadError}</div>;
  }
  if (!schedule) {
    return <div className="text-muted-foreground p-8 text-center">면접 일정을 불러오는 중입니다.</div>;
  }

  const { plan, applicants } = schedule;
  const bySlot = availableApplicantsBySlot(schedule.host_slots, applicants);
  const assignedByKey = new Map(
    applicants
      .filter((applicant) => applicant.assigned_slot)
      .map((applicant) => [
        timeSlotKey(applicant.assigned_slot!.date, applicant.assigned_slot!.start_minute),
        applicant,
      ]),
  );
  const unassignedCount = applicants.filter((applicant) => !applicant.assigned_slot).length;

  return (
    <div className="space-y-10 p-4 sm:p-6 md:p-8">
      <PageHeader
        title="면접 일정"
        description={
          title
            ? `${title} 회차의 면접 시간을 회장단과 지원자의 가능 시간을 맞춰 정합니다.`
            : "회장단과 지원자의 가능 시간을 맞춰 면접 시간을 정합니다."
        }
        leadingAction={
          <Button variant="ghost" size="icon" className="size-11" asChild>
            <Link href="/staff-recruitments" aria-label="모집 관리로 돌아가기" title="모집 관리로 돌아가기">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        }
      />

      <section className="space-y-3" aria-labelledby="host-slots-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="host-slots-heading" className="text-lg font-bold">
              회장단 면접 가능 시간
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              회장단이 면접을 볼 수 있는 시간을 칠해 주세요. 시간 단위는{" "}
              {plan.slot_minutes === 60 ? "1시간" : `${plan.slot_minutes}분`}입니다.
            </p>
          </div>
          <Button
            disabled={!hostDirty || busy}
            onClick={() =>
              run(
                () => saveStaffInterviewHostSlots(recruitmentId, toInterviewSlotRequest(hostDraft)),
                "회장단 가능 시간을 저장했습니다.",
              )
            }
          >
            {hostDirty ? "가능 시간 저장" : "저장됨"}
          </Button>
        </div>
        <TimeSlotGrid
          dates={plan.dates}
          startHour={plan.start_hour}
          endHour={plan.end_hour}
          slotMinutes={plan.slot_minutes}
          value={hostDraft}
          onChange={setHostDraft}
          disabled={busy}
          description={null}
          ariaLabel="회장단 면접 가능 시간 선택표"
        />
      </section>

      <section className="space-y-3" aria-labelledby="by-slot-heading">
        <div>
          <h2 id="by-slot-heading" className="text-lg font-bold">
            시간대별 가능 지원자
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            회장단과 지원자가 모두 되는 시간입니다. 지원자 이름을 누르면 그 시간에 배정됩니다.
          </p>
        </div>

        {bySlot.size === 0 ? (
          <p className="text-muted-foreground rounded-lg border p-6 text-center text-sm">
            저장된 회장단 가능 시간이 없습니다. 위에서 시간을 칠하고 저장해 주세요.
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {Array.from(bySlot.entries()).map(([key, candidates]) => {
              const slot = parseTimeSlotKey(key);
              const assigned = assignedByKey.get(key);
              return (
                <li key={key} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
                  <span className="w-56 shrink-0 text-sm font-medium tabular-nums">
                    {formatDate(slot.date)} {formatSlotRange(slot.startMinute, plan.slot_minutes)}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {assigned ? (
                      <>
                        <Badge className="bg-primary-50 text-white">{assigned.applicant_name} 배정</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() =>
                            run(() => unassignStaffInterview(recruitmentId, assigned.application_id))
                          }
                        >
                          배정 취소
                        </Button>
                      </>
                    ) : candidates.length === 0 ? (
                      <span className="text-muted-foreground text-sm">가능한 지원자 없음</span>
                    ) : (
                      candidates.map((candidate) => {
                        const elsewhere = candidate.assigned_slot !== null;
                        return (
                          <Button
                            key={candidate.application_id}
                            variant="outline"
                            size="sm"
                            disabled={busy || elsewhere}
                            title={elsewhere ? `이미 ${formatSlot(candidate.assigned_slot!, plan.slot_minutes)}에 배정됨` : undefined}
                            onClick={() =>
                              run(() =>
                                assignStaffInterview(recruitmentId, candidate.application_id, {
                                  date: slot.date,
                                  start_minute: slot.startMinute,
                                }),
                              )
                            }
                          >
                            {candidate.applicant_name}
                            <span className="text-muted-foreground ml-1 text-xs">
                              {departmentsOf(candidate).first}
                              {elsewhere ? " · 배정됨" : ""}
                            </span>
                          </Button>
                        );
                      })
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="applicants-heading">
        <div>
          <h2 id="applicants-heading" className="text-lg font-bold">
            지원자별 면접 일시
          </h2>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>1지망</TableHead>
                <TableHead>2지망</TableHead>
                <TableHead>면접 일시</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                    이 회차에 제출된 지원서가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                applicants.map((applicant) => (
                  <ApplicantRow
                    key={applicant.application_id}
                    applicant={applicant}
                    schedule={schedule}
                    busy={busy}
                    onAssign={(slot) =>
                      run(
                        () => assignStaffInterview(recruitmentId, applicant.application_id, slot),
                        `${applicant.applicant_name}의 면접 시간을 정했습니다.`,
                      )
                    }
                    onUnassign={() =>
                      run(() => unassignStaffInterview(recruitmentId, applicant.application_id))
                    }
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        {schedule.confirmed_at && (
          <Link
            href={`/staff-recruitments/${recruitmentId}/interviews`}
            className="text-sm underline underline-offset-2"
          >
            면접 관리로 가기
          </Link>
        )}
        {unassignedCount > 0 && (
          <p className="text-muted-foreground text-sm">
            면접 시간이 정해지지 않은 지원자가 {unassignedCount}명 있습니다. 확정 후에도 정할 수 있습니다.
          </p>
        )}
        <Button
          className="sm:ml-auto"
          disabled={busy || hostDirty}
          title={hostDirty ? "회장단 가능 시간을 먼저 저장해 주세요." : undefined}
          onClick={async () => {
            // 확정하면 바로 면접 관리로 넘어가 질문을 정하고 면접을 시작한다.
            if (await run(() => confirmStaffInterviewSchedule(recruitmentId), "면접 일정을 확정했습니다.")) {
              router.push(`/staff-recruitments/${recruitmentId}/interviews`);
            }
          }}
        >
          일정 확정하기
        </Button>
      </footer>
    </div>
  );
}

function ApplicantRow({
  applicant,
  schedule,
  busy,
  onAssign,
  onUnassign,
}: {
  applicant: StaffInterviewScheduleApplicant;
  schedule: StaffInterviewSchedule;
  busy: boolean;
  onAssign: (slot: StaffInterviewSlot) => void;
  onUnassign: () => void;
}) {
  const { plan } = schedule;
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(applicant.assigned_slot?.date ?? plan.dates[0] ?? "");
  const [minute, setMinute] = useState<string>("");

  // 다른 지원자가 들어간 시간은 고를 수 없다. 면접은 한 타임에 한 명이다.
  const takenByOthers = new Set(
    schedule.applicants
      .filter((other) => other.application_id !== applicant.application_id && other.assigned_slot)
      .map((other) => timeSlotKey(other.assigned_slot!.date, other.assigned_slot!.start_minute)),
  );
  const freeMinutes = interviewSlotStarts(plan).filter((start) => !takenByOthers.has(timeSlotKey(date, start)));
  const { first, second } = departmentsOf(applicant);
  const noOverlap = hasNoOverlap(schedule.host_slots, applicant);

  return (
    <TableRow>
      <TableCell className="font-medium">{applicant.applicant_name}</TableCell>
      <TableCell>{first}</TableCell>
      <TableCell>{second}</TableCell>
      <TableCell>
        {editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={date}
              onValueChange={(next) => {
                setDate(next);
                setMinute("");
              }}
            >
              <SelectTrigger className="w-32" aria-label={`${applicant.applicant_name} 면접 날짜`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {plan.dates.map((candidate) => (
                  <SelectItem key={candidate} value={candidate}>
                    {formatDate(candidate)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={minute} onValueChange={setMinute}>
              <SelectTrigger className="w-44" aria-label={`${applicant.applicant_name} 면접 시간`}>
                <SelectValue placeholder="시간 선택" />
              </SelectTrigger>
              <SelectContent>
                {freeMinutes.map((start) => (
                  <SelectItem key={start} value={String(start)}>
                    {formatSlotRange(start, plan.slot_minutes)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : applicant.assigned_slot ? (
          <span className="tabular-nums">{formatSlot(applicant.assigned_slot, plan.slot_minutes)}</span>
        ) : (
          <span className="text-muted-foreground inline-flex flex-wrap items-center gap-2">
            미정
            {noOverlap && <Badge variant="outline">겹치는 시간 없음</Badge>}
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {editing ? (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              취소
            </Button>
            <Button
              size="sm"
              disabled={busy || !minute}
              onClick={() => {
                onAssign({ date, start_minute: Number(minute) });
                setEditing(false);
              }}
            >
              저장
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            {applicant.assigned_slot && (
              <Button variant="ghost" size="sm" disabled={busy} onClick={onUnassign}>
                배정 취소
              </Button>
            )}
            <Button variant="outline" size="sm" disabled={busy} onClick={() => setEditing(true)}>
              {applicant.assigned_slot ? "수정하기" : "직접 정하기"}
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
