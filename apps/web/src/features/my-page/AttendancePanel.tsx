"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@ui/components/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/server";
import {
  getAttendance,
  updateAttendance,
  type AttendanceStatus,
  type StudyAttendanceData,
} from "@core/study-manage/api";

interface AttendancePanelProps {
  studyId: number;
  /** 지난 학기 스터디는 조회만 가능하다 */
  readOnly?: boolean;
}

const DEFAULT_WEEK_COUNT = 8;
const MAX_WEEK_COUNT = 16;

type CellKey = `${number}:${number}`; // "userId:weekNum"

export function AttendancePanel({
  studyId,
  readOnly = false,
}: AttendancePanelProps) {
  const [data, setData] = useState<StudyAttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [weekCount, setWeekCount] = useState(DEFAULT_WEEK_COUNT);
  // 저장 전 로컬 변경분: "userId:weekNum" → present/absent
  const [pending, setPending] = useState<Map<CellKey, AttendanceStatus>>(
    new Map(),
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await getAttendance(studyId);
      setData(result);
      const maxWeek = Math.max(
        DEFAULT_WEEK_COUNT,
        ...result.mentees.flatMap((m) => m.records.map((r) => r.week_num)),
      );
      setWeekCount(Math.min(maxWeek, MAX_WEEK_COUNT));
      setPending(new Map());
    } catch {
      setErrorMessage("출석 현황을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [studyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 서버 기준 상태 맵: "userId:weekNum" → status
  const savedStatus = useMemo(() => {
    const map = new Map<CellKey, AttendanceStatus>();
    data?.mentees.forEach((mentee) => {
      mentee.records.forEach((record) => {
        map.set(`${mentee.user_id}:${record.week_num}`, record.status);
      });
    });
    return map;
  }, [data]);

  const cellStatus = (key: CellKey): AttendanceStatus | undefined =>
    pending.get(key) ?? savedStatus.get(key);

  // 클릭 시 순환: 미기록 → 출석 → 결석 → 출석 → ...
  // (저장된 기록은 삭제 API가 없어 미기록으로 되돌릴 수 없음)
  const toggleCell = (userId: number, weekNum: number) => {
    const key: CellKey = `${userId}:${weekNum}`;
    const current = cellStatus(key);
    const next: AttendanceStatus = current === "present" ? "absent" : "present";
    setPending((prev) => {
      const map = new Map(prev);
      if (savedStatus.get(key) === next) {
        map.delete(key); // 서버 상태와 같아지면 변경분에서 제거
      } else {
        map.set(key, next);
      }
      return map;
    });
  };

  const presentCount = (userId: number) => {
    let count = 0;
    for (let week = 1; week <= weekCount; week++) {
      if (cellStatus(`${userId}:${week}`) === "present") count++;
    }
    return count;
  };

  const handleSave = async () => {
    if (pending.size === 0 || isSaving) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const attendances = Array.from(pending.entries()).map(([key, status]) => {
        const [userId, weekNum] = key.split(":").map(Number);
        return { user_id: userId!, week_num: weekNum!, status };
      });
      await updateAttendance(studyId, attendances);
      await fetchData();
    } catch {
      setErrorMessage("출석 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <p className="text-lg">불러오는 중...</p>
      </div>
    );
  }

  if (!data || data.mentees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg">출석을 기록할 멘티가 없습니다</p>
      </div>
    );
  }

  const weeks = Array.from({ length: weekCount }, (_, i) => i + 1);

  return (
    <div>
      <div className="mb-4 flex items-center">
        <p className="text-text-basic text-body-l font-bold leading-normal">
          멘티 <span className="text-text-primary">{data.mentees.length}</span>
          명
          <span className="text-text-subtle text-body-s ml-3 font-normal">
            칸을 눌러 출석/결석을 표시한 뒤 저장하세요
          </span>
        </p>
      </div>

      {errorMessage && (
        <p className="text-text-danger text-body-s mb-4">{errorMessage}</p>
      )}

      <Table containerClassName="overflow-x-auto" className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">이름</TableHead>
            <TableHead>학과</TableHead>
            {weeks.map((week) => (
              <TableHead key={week} className="min-w-[52px] px-2 text-center">
                {week}주차
              </TableHead>
            ))}
            <TableHead className="whitespace-nowrap text-center">
              출석
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.mentees.map((mentee) => {
            const total = presentCount(mentee.user_id);
            return (
              <TableRow key={mentee.user_id}>
                <TableCell className="whitespace-nowrap font-bold">
                  {mentee.user_name}
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {mentee.department}
                </TableCell>
                {weeks.map((week) => {
                  const key: CellKey = `${mentee.user_id}:${week}`;
                  const status = cellStatus(key);
                  const isDirty = pending.has(key);
                  return (
                    <TableCell key={week} className="px-1 py-1">
                      <button
                        onClick={() => toggleCell(mentee.user_id, week)}
                        aria-label={`${mentee.user_name} ${week}주차 출석 상태 변경`}
                        className={`text-body-xs h-9 w-11 rounded-md font-bold transition-colors ${
                          status === "present"
                            ? "bg-surface-primary-subtler text-text-primary"
                            : status === "absent"
                              ? "bg-surface-danger-subtler text-text-danger"
                              : "bg-surface-gray-subtler text-text-disabled hover:bg-surface-gray-subtle"
                        } ${isDirty ? "ring-border-primary ring-1" : ""}`}
                      >
                        {status === "present"
                          ? "출석"
                          : status === "absent"
                            ? "결석"
                            : "－"}
                      </button>
                    </TableCell>
                  );
                })}
                <TableCell
                  className={`whitespace-nowrap px-4 py-2 font-bold ${
                    total >= 5 ? "text-text-primary" : "text-text-subtle"
                  }`}
                >
                  {total}회
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="tertiary"
          size="medium"
          disabled={weekCount >= MAX_WEEK_COUNT || readOnly}
          onClick={() => setWeekCount((w) => Math.min(w + 1, MAX_WEEK_COUNT))}
        >
          주차 추가
        </Button>
        <Button
          variant="primary"
          size="medium"
          disabled={pending.size === 0 || isSaving || readOnly}
          onClick={handleSave}
        >
          {isSaving
            ? "저장 중..."
            : `저장${pending.size > 0 ? ` (${pending.size})` : ""}`}
        </Button>
      </div>

      <p className="text-text-subtle text-body-xs mt-3">
        수료 기준: 출석 5회 이상 (수료증 발급은 운영진이 진행합니다)
      </p>
    </div>
  );
}
