"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { ActivitySemesterToggle } from "@/components/list/activity-semester-toggle";
import { Button } from "@/components/ui/button";
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function MentorConfirmationsView({
  studies,
  currentSemester,
  previousSemester,
  selectedSemester,
}: MentorConfirmationsViewProps) {
  const router = useRouter();
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(null);
  const [targetsData, setTargetsData] =
    useState<MentorConfirmationTargetsData | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [downloadingUserId, setDownloadingUserId] = useState<number | null>(
    null,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (selectedStudyId == null) {
      setTargetsData(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    getMentorConfirmationTargets(selectedStudyId)
      .then((data) => {
        if (!cancelled) {
          setTargetsData(data);
          setSelectedIds(new Set(data.targets.map((target) => target.user_id)));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setTargetsData(null);
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
  }, [selectedStudyId]);

  const handleIssue = async () => {
    if (selectedStudyId == null || selectedIds.size === 0 || isIssuing) return;
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
      const result = await issueMentorConfirmations(
        selectedStudyId,
        Array.from(selectedIds),
        `${toDotDate(startDate)}~${toDotDate(endDate)}`,
      );
      toast.success(`${result.success_count}명의 멘토 확인서를 발급했습니다.`);
      const updated = await getMentorConfirmationTargets(selectedStudyId);
      setTargetsData(updated);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "확인서 발급에 실패했습니다.",
      );
    } finally {
      setIsIssuing(false);
    }
  };

  const handleDownload = async (userId: number) => {
    if (selectedStudyId == null || downloadingUserId != null) return;

    const downloadWindow = window.open("", "_blank");
    if (downloadWindow == null) {
      toast.error("팝업이 차단되어 확인서를 열 수 없습니다.");
      return;
    }

    setDownloadingUserId(userId);
    try {
      const confirmation = await getMentorConfirmationViewUrl(
        selectedStudyId,
        userId,
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
      setDownloadingUserId(null);
    }
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedStudyId(null);
    setTargetsData(null);
    setSelectedIds(new Set());
    setIsLoading(false);
    router.push(`/mentor-confirmations?semester=${semester}`);
  };

  const targets = targetsData?.targets ?? [];

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
          <label className="text-sm font-medium">스터디</label>
          <Select
            value={selectedStudyId != null ? String(selectedStudyId) : ""}
            onValueChange={(value) => setSelectedStudyId(Number(value))}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="스터디를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {studies.map((study) => (
                <SelectItem key={study.id} value={String(study.id)}>
                  {study.study_name} ({study.primary_mentor_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          disabled={selectedIds.size === 0 || isIssuing}
        >
          {isIssuing ? "발급 중..." : `선택 ${selectedIds.size}명 확인서 발급`}
        </Button>
      </div>

      {selectedStudyId == null ? (
        <div className="text-muted-foreground flex justify-center py-20">
          스터디를 선택하면 멘토 발급 대상이 표시됩니다.
        </div>
      ) : isLoading ? (
        <div className="text-muted-foreground flex justify-center py-20">
          불러오는 중...
        </div>
      ) : targets.length === 0 ? (
        <div className="text-muted-foreground flex justify-center py-20">
          해당 스터디에 등록된 멘토가 없습니다.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    aria-label="전체 선택"
                    checked={selectedIds.size === targets.length}
                    onChange={() =>
                      setSelectedIds((current) =>
                        current.size === targets.length
                          ? new Set()
                          : new Set(targets.map((target) => target.user_id)),
                      )
                    }
                  />
                </TableHead>
                <TableHead>이름</TableHead>
                <TableHead>학번</TableHead>
                <TableHead>학과</TableHead>
                <TableHead className="text-center">발급 상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((target) => (
                <TableRow key={target.user_id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`${target.user_name} 선택`}
                      checked={selectedIds.has(target.user_id)}
                      onChange={() =>
                        setSelectedIds((current) => {
                          const next = new Set(current);
                          next.has(target.user_id)
                            ? next.delete(target.user_id)
                            : next.add(target.user_id);
                          return next;
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {target.user_name}
                  </TableCell>
                  <TableCell>{target.user_id}</TableCell>
                  <TableCell>{target.department ?? "-"}</TableCell>
                  <TableCell className="text-center">
                    {target.confirmation_status === 1 ? (
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-blue-600"
                        disabled={downloadingUserId != null}
                        onClick={() => handleDownload(target.user_id)}
                      >
                        {downloadingUserId === target.user_id
                          ? "불러오는 중..."
                          : "발급됨"}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">미발급</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
