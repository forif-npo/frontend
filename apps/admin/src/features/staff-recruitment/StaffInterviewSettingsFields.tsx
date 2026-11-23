"use client";
import { useMemo, useState } from "react";
import { TimeSlotGrid } from "@ui/components/client";
import { datesInRange, formatSlotTime } from "@core/time-slot";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INTERVIEW_SLOT_MINUTE_OPTIONS, MAX_INTERVIEW_HOUR, MIN_INTERVIEW_HOUR, type InterviewFormState, type InterviewSlotMinutes, validateInterviewForm } from "./form";

const START_HOURS = Array.from(
  { length: MAX_INTERVIEW_HOUR - MIN_INTERVIEW_HOUR },
  (_, index) => MIN_INTERVIEW_HOUR + index,
);
const END_HOURS = Array.from(
  { length: MAX_INTERVIEW_HOUR - MIN_INTERVIEW_HOUR },
  (_, index) => MIN_INTERVIEW_HOUR + index + 1,
);

/**
 * 모집 폼의 면접 일정 설정.
 *
 * 면접 기간과 한 칸(= 면접 한 번)의 길이, 하루 중 받을 시간 범위를 정한다.
 * 아래 미리보기는 지원자가 지원서에서 보게 될 시간표와 같은 컴포넌트다.
 */
export function StaffInterviewSettingsFields({
  value,
  onChange,
}: {
  value: InterviewFormState;
  onChange: (next: InterviewFormState) => void;
}) {
  const update = (patch: Partial<InterviewFormState>) =>
    onChange({ ...value, ...patch });

  const dates = useMemo(
    () => datesInRange(value.startDate, value.endDate),
    [value.startDate, value.endDate],
  );
  const range = {
    startHour: Number(value.startHour),
    endHour: Number(value.endHour),
    slotMinutes: Number(value.slotMinutes),
  };
  const valid = value.enabled && validateInterviewForm(value) === null;

  // 미리보기에서 칠한 칸은 저장하지 않는다. 지원자 화면을 시험해 보는 용도다.
  const [preview, setPreview] = useState<Set<string>>(new Set());

  return (
    <section className="grid gap-4 rounded-md border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium leading-none">면접 일정</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(event) => update({ enabled: event.target.checked })}
          />
          지원서에서 면접 가능 시간 받기
        </label>
      </div>

      {value.enabled && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="interview-start-date">면접 시작일</Label>
              <Input
                id="interview-start-date"
                type="date"
                value={value.startDate}
                onChange={(event) => update({ startDate: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interview-end-date">면접 종료일</Label>
              <Input
                id="interview-end-date"
                type="date"
                min={value.startDate || undefined}
                value={value.endDate}
                onChange={(event) => update({ endDate: event.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="interview-start-hour">시작 시각</Label>
              <Select
                value={value.startHour}
                onValueChange={(next) => update({ startHour: next })}
              >
                <SelectTrigger id="interview-start-hour">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {START_HOURS.map((hour) => (
                    <SelectItem key={hour} value={String(hour)}>
                      {formatSlotTime(hour * 60)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interview-end-hour">종료 시각</Label>
              <Select
                value={value.endHour}
                onValueChange={(next) => update({ endHour: next })}
              >
                <SelectTrigger id="interview-end-hour">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {END_HOURS.map((hour) => (
                    <SelectItem key={hour} value={String(hour)}>
                      {formatSlotTime(hour * 60)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interview-slot-minutes">면접 단위</Label>
              <Select
                value={value.slotMinutes}
                onValueChange={(next: InterviewSlotMinutes) =>
                  update({ slotMinutes: next })
                }
              >
                <SelectTrigger id="interview-slot-minutes">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERVIEW_SLOT_MINUTE_OPTIONS.map((minutes) => (
                    <SelectItem key={minutes} value={minutes}>
                      {minutes === "60" ? "1시간" : `${minutes}분`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {valid && (
            <div className="grid gap-2">
              <span className="text-sm font-medium">지원자 화면 미리보기</span>
              <TimeSlotGrid
                dates={dates}
                startHour={range.startHour}
                endHour={range.endHour}
                slotMinutes={range.slotMinutes}
                value={preview}
                onChange={setPreview}
                description={
                  <span className="text-muted-foreground text-xs">
                    지원자에게 보이는 시간표입니다. 여기서 칠한 칸은 저장되지 않습니다.
                  </span>
                }
                ariaLabel="면접 가능 시간 미리보기"
                gridClassName="w-full"
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
