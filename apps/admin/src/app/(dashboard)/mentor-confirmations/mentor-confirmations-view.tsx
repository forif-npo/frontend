"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { ActivitySemesterToggle } from "@/components/list/activity-semester-toggle";
import { Button } from "@/components/ui/button";
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import { DataTable } from "@/components/list/data-table";
import type { SemesterLabel, Study } from "../studies/types";
import {
  getMentorConfirmationViewUrl,
  getMentorConfirmationTargets,
  issueMentorConfirmations,
  type MentorConfirmationTargetsData,
} from "./api";

interface MentorConfirmationsViewProps {
  studies: Study[];
  currentSemester: SemesterLabel;
  previousSemester?: SemesterLabel;
  selectedSemester: SemesterLabel;
}

const toDotDate = (iso: string) => `${iso.replaceAll("-", ".")}.`;
const dateToIso = (date: Date | undefined) =>
  date ? format(date, "yyyy-MM-dd") : "";
const isoToDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`) : undefined;
type MentorConfirmationTarget =
  MentorConfirmationTargetsData["targets"][number];
type MentorConfirmationTargetWithStudy = MentorConfirmationTarget & {
  study_id: number;
  study_name: string;
};

const getTargetKey = (target: MentorConfirmationTargetWithStudy) =>
  `${target.study_id}:${target.user_id}`;

export function MentorConfirmationsView({
  studies,
  currentSemester,
  previousSemester,
  selectedSemester,
}: MentorConfirmationsViewProps) {
  const router = useRouter();
  const [targets, setTargets] = useState<MentorConfirmationTargetWithStudy[]>(
    [],
  );
  const [selectedTargetKeys, setSelectedTargetKeys] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  const [downloadingTargetKey, setDownloadingTargetKey] = useState<
    string | null
  >(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all(
      studies.map(async (study) => {
        const data = await getMentorConfirmationTargets(study.id);
        return data.targets.map((target) => ({
          ...target,
          study_id: study.id,
          study_name: study.study_name,
        }));
      }),
    )
      .then((targetGroups) => {
        if (!cancelled) {
          const allTargets = targetGroups.flat();
          setTargets(allTargets);
          setSelectedTargetKeys(
            new Set(allTargets.map((target) => getTargetKey(target))),
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setTargets([]);
          setSelectedTargetKeys(new Set());
          toast.error(
            error instanceof Error
              ? error.message
              : "발급 대상을 불러오지 못했습니다.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studies]);

  const handleIssue = async () => {
    if (selectedTargetKeys.size === 0 || isIssuing) return;
    if (!startDate || !endDate) {
      toast.error("활동 기간을 모두 입력해주세요.");
      return;
    }
    if (startDate > endDate) {
      toast.error("활동 시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }

    setIsIssuing(true);
    try {
      const targetIdsByStudy = new Map<number, number[]>();
      targets
        .filter((target) => selectedTargetKeys.has(getTargetKey(target)))
        .forEach((target) => {
          const userIds = targetIdsByStudy.get(target.study_id) ?? [];
          userIds.push(target.user_id);
          targetIdsByStudy.set(target.study_id, userIds);
        });
      const results = await Promise.all(
        Array.from(targetIdsByStudy, ([studyId, userIds]) =>
          issueMentorConfirmations(
            studyId,
            userIds,
            `${toDotDate(startDate)}~${toDotDate(endDate)}`,
          ),
        ),
      );
      const successCount = results.reduce(
        (count, result) => count + result.success_count,
        0,
      );
      toast.success(`${successCount}명의 멘토 확인서를 발급했습니다.`);
      setTargets((current) =>
        current.map((target) =>
          selectedTargetKeys.has(getTargetKey(target))
            ? { ...target, confirmation_status: 1 }
            : target,
        ),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "확인서 발급에 실패했습니다.",
      );
    } finally {
      setIsIssuing(false);
    }
  };

  const handleDownload = useCallback(
    async (target: MentorConfirmationTargetWithStudy) => {
      if (downloadingTargetKey != null) return;

      const downloadWindow = window.open("", "_blank");
      if (downloadWindow == null) {
        toast.error("팝업이 차단되어 확인서를 열 수 없습니다.");
        return;
      }

      const targetKey = getTargetKey(target);
      setDownloadingTargetKey(targetKey);
      try {
        const confirmation = await getMentorConfirmationViewUrl(
          target.study_id,
          target.user_id,
        );
        if (confirmation.confirmation_url) {
          downloadWindow.location.href = confirmation.confirmation_url;
        } else {
          downloadWindow.close();
        }
      } catch (error) {
        downloadWindow.close();
        toast.error(
          error instanceof Error
            ? error.message
            : "확인서를 불러오지 못했습니다.",
        );
      } finally {
        setDownloadingTargetKey(null);
      }
    },
    [downloadingTargetKey],
  );

  const handleSemesterChange = (semester: string) => {
    setTargets([]);
    setSelectedTargetKeys(new Set());
    setIsLoading(true);
    router.push(`/mentor-confirmations?semester=${semester}`);
  };

  const rowSelection = useMemo<RowSelectionState>(
    () =>
      Object.fromEntries(
        Array.from(selectedTargetKeys, (targetKey) => [targetKey, true]),
      ),
    [selectedTargetKeys],
  );
  const updateRowSelection = (
    updater:
      | RowSelectionState
      | ((current: RowSelectionState) => RowSelectionState),
  ) => {
    setSelectedTargetKeys((current) => {
      const currentSelection = Object.fromEntries(
        Array.from(current, (targetKey) => [targetKey, true]),
      );
      const nextSelection =
        typeof updater === "function" ? updater(currentSelection) : updater;
      return new Set(
        Object.entries(nextSelection)
          .filter(([, selected]) => selected)
          .map(([targetKey]) => targetKey),
      );
    });
  };
  const columns = useMemo<ColumnDef<MentorConfirmationTargetWithStudy>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: "이름",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.user_name}</span>
        ),
      },
      { accessorKey: "user_id", header: "학번" },
      {
        accessorKey: "department",
        header: "학과",
        cell: ({ row }) => row.original.department ?? "-",
      },
      { accessorKey: "study_name", header: "스터디" },
      {
        accessorKey: "confirmation_status",
        header: () => <div className="text-center">발급 상태</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.confirmation_status === 1 ? (
              <Button
                type="button"
                variant="link"
                className="text-text-primary h-auto p-0"
                disabled={downloadingTargetKey != null}
                onClick={() => handleDownload(row.original)}
              >
                {downloadingTargetKey === getTargetKey(row.original)
                  ? "불러오는 중..."
                  : "발급됨"}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            ) : (
              <span className="text-muted-foreground">미발급</span>
            )}
          </div>
        ),
      },
    ],
    [downloadingTargetKey, handleDownload],
  );

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="멘토 확인서 발급"
        description="종료된 학기에 스터디를 운영한 멘토에게 활동 확인서를 발급합니다."
      />
      <ActivitySemesterToggle
        currentSemester={currentSemester}
        previousSemester={previousSemester}
        selectedSemester={selectedSemester}
        onSemesterChange={handleSemesterChange}
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">활동 기간 (확인서 표기)</label>
          <div className="flex items-center gap-2">
            <SingleDayPicker
              className="w-[160px]"
              placeholder="시작일 선택"
              labelVariant="yyyy. MM. dd."
              value={isoToDate(startDate)}
              onSelect={(date) => setStartDate(dateToIso(date))}
            />
            <span className="text-muted-foreground">~</span>
            <SingleDayPicker
              className="w-[160px]"
              placeholder="종료일 선택"
              labelVariant="yyyy. MM. dd."
              value={isoToDate(endDate)}
              onSelect={(date) => setEndDate(dateToIso(date))}
            />
          </div>
        </div>
        <Button
          onClick={handleIssue}
          disabled={selectedTargetKeys.size === 0 || isIssuing}
        >
          {isIssuing
            ? "발급 중..."
            : `선택 ${selectedTargetKeys.size}명 확인서 발급`}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground flex justify-center py-20">
          불러오는 중...
        </div>
      ) : targets.length === 0 ? (
        <div className="text-muted-foreground flex justify-center py-20">
          해당 학기에 등록된 멘토가 없습니다.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={targets}
          getRowId={getTargetKey}
          enableRowSelection
          rowSelection={rowSelection}
          onRowSelectionChange={updateRowSelection}
          showPagination={false}
        />
      )}
    </div>
  );
}
