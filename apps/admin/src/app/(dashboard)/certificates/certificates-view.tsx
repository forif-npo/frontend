"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SemesterTabs } from "@/components/list/semester-tabs";
import { handleApiError } from "@core/utils/api-client";
import type { SemesterLabel, Study } from "../studies/types";
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
  getCertificateTargets,
  issueCertificates,
  issueManualCertificate,
  type CertificateTargetsData,
  type IssueCertificatesData,
} from "./api";

interface ManualForm {
  userName: string;
  studentNumber: string;
  department: string;
  studyName: string;
  activityPeriod: string;
  issueDate: string;
  presidentName: string;
}

const EMPTY_MANUAL_FORM: ManualForm = {
  userName: "",
  studentNumber: "",
  department: "",
  studyName: "",
  activityPeriod: "",
  issueDate: "",
  presidentName: "",
};

interface CertificatesViewProps {
  studies: Study[];
  currentSemester: SemesterLabel;
}

export function CertificatesView({
  studies,
  currentSemester,
}: CertificatesViewProps) {
  const router = useRouter();
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(null);
  const [targetsData, setTargetsData] = useState<CertificateTargetsData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activityPeriod, setActivityPeriod] = useState("");
  const [lastResult, setLastResult] = useState<IssueCertificatesData | null>(
    null,
  );

  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState<ManualForm>(EMPTY_MANUAL_FORM);
  const [manualResultUrl, setManualResultUrl] = useState<string | null>(null);
  const [isManualIssuing, setIsManualIssuing] = useState(false);

  const fetchTargets = useCallback(async (studyId: number) => {
    setIsLoading(true);
    setLastResult(null);
    try {
      const data = await getCertificateTargets(studyId);
      setTargetsData(data);
      // 자격 충족자를 기본 선택
      setSelectedIds(
        new Set(data.targets.filter((t) => t.eligible).map((t) => t.user_id)),
      );
    } catch (error) {
      toast.error(await handleApiError(error));
      setTargetsData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedStudyId != null) {
      fetchTargets(selectedStudyId);
    }
  }, [selectedStudyId, fetchTargets]);

  const handleSemesterChange = (semester: string) => {
    setSelectedStudyId(null);
    setTargetsData(null);
    router.push(`/certificates?semester=${semester}`);
  };

  const toggleSelect = (userId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleIssue = async () => {
    if (selectedStudyId == null || selectedIds.size === 0 || isIssuing) return;
    if (!activityPeriod.trim()) {
      toast.error("활동 기간을 입력해주세요. 예: 2026.03.02.~2026.06.20.");
      return;
    }
    if (
      !confirm(
        `선택한 ${selectedIds.size}명의 수료증을 발급할까요?\n이미 발급된 부원은 재발급됩니다.`,
      )
    ) {
      return;
    }

    setIsIssuing(true);
    try {
      const result = await issueCertificates(
        selectedStudyId,
        Array.from(selectedIds),
        activityPeriod.trim(),
      );
      setLastResult(result);
      toast.success(
        `발급 완료 ${result.success_count}건${result.skipped_count > 0 ? `, 스킵 ${result.skipped_count}건` : ""}`,
      );
      await fetchTargets(selectedStudyId);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsIssuing(false);
    }
  };

  const handleManualIssue = async () => {
    if (isManualIssuing) return;
    const required: [string, string][] = [
      [manualForm.userName, "이름"],
      [manualForm.studentNumber, "학번"],
      [manualForm.department, "학과"],
      [manualForm.studyName, "스터디명"],
      [manualForm.activityPeriod, "활동 기간"],
    ];
    const missing = required.find(([value]) => !value.trim());
    if (missing) {
      toast.error(`${missing[1]}을(를) 입력해주세요.`);
      return;
    }

    setIsManualIssuing(true);
    try {
      const url = await issueManualCertificate({
        user_name: manualForm.userName.trim(),
        student_number: manualForm.studentNumber.trim(),
        department: manualForm.department.trim(),
        study_name: manualForm.studyName.trim(),
        activity_period: manualForm.activityPeriod.trim(),
        issue_date: manualForm.issueDate.trim() || undefined,
        president_name: manualForm.presidentName.trim() || undefined,
      });
      setManualResultUrl(url);
      toast.success("수료증이 생성되었습니다.");
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsManualIssuing(false);
    }
  };

  const closeManualDialog = () => {
    setManualOpen(false);
    setManualForm(EMPTY_MANUAL_FORM);
    setManualResultUrl(null);
  };

  const targets = targetsData?.targets ?? [];
  const eligibleCount = targets.filter((t) => t.eligible).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Award className="h-6 w-6" />
            인증서 발급
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            수료 기준(출석 {targetsData?.required_attendance ?? 5}회 이상 + 해당
            학기 해커톤 참여)을 충족한 부원에게 수료증을 발급합니다.
          </p>
        </div>
        <Button variant="outline" onClick={() => setManualOpen(true)}>
          수동 발급
        </Button>
      </div>

      <SemesterTabs
        currentSemester={currentSemester}
        onSemesterChange={handleSemesterChange}
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">스터디</label>
          <Select
            value={selectedStudyId != null ? String(selectedStudyId) : ""}
            onValueChange={(v) => setSelectedStudyId(Number(v))}
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
          <label className="text-sm font-medium">활동 기간 (수료증 표기)</label>
          <Input
            className="w-[280px]"
            placeholder="2026.03.02.~2026.06.20."
            value={activityPeriod}
            onChange={(e) => setActivityPeriod(e.target.value)}
          />
        </div>
        <Button
          onClick={handleIssue}
          disabled={selectedIds.size === 0 || isIssuing}
        >
          {isIssuing ? "발급 중..." : `선택 ${selectedIds.size}명 수료증 발급`}
        </Button>
      </div>

      {lastResult && lastResult.skipped_count > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="mb-1 font-medium">스킵된 대상</p>
          <ul className="list-inside list-disc">
            {lastResult.results
              .filter((r) => !r.success)
              .map((r) => (
                <li key={r.user_id}>
                  {r.user_name ?? r.user_id}: {r.message}
                </li>
              ))}
          </ul>
        </div>
      )}

      {selectedStudyId == null ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
          <p>스터디를 선택하면 발급 대상이 표시됩니다</p>
        </div>
      ) : isLoading ? (
        <div className="text-muted-foreground flex items-center justify-center py-20">
          <p>불러오는 중...</p>
        </div>
      ) : targets.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
          <p>해당 스터디에 멘티가 없습니다</p>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm">
            멘티 <span className="font-bold">{targets.length}</span>명 중 자격
            충족{" "}
            <span className="font-bold text-blue-600">{eligibleCount}</span>명
          </p>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      aria-label="자격 충족자 전체 선택"
                      checked={
                        eligibleCount > 0 && selectedIds.size >= eligibleCount
                      }
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.size > 0
                            ? new Set()
                            : new Set(
                                targets
                                  .filter((t) => t.eligible)
                                  .map((t) => t.user_id),
                              ),
                        )
                      }
                    />
                  </TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>학번</TableHead>
                  <TableHead>학과</TableHead>
                  <TableHead className="text-center">출석</TableHead>
                  <TableHead className="text-center">해커톤</TableHead>
                  <TableHead className="text-center">자격</TableHead>
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
                        onChange={() => toggleSelect(target.user_id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {target.user_name}
                    </TableCell>
                    <TableCell>{target.user_id}</TableCell>
                    <TableCell>{target.department ?? "-"}</TableCell>
                    <TableCell
                      className={`text-center ${
                        target.attendance_count >=
                        (targetsData?.required_attendance ?? 5)
                          ? "font-bold text-blue-600"
                          : ""
                      }`}
                    >
                      {target.attendance_count}회
                    </TableCell>
                    <TableCell className="text-center">
                      {target.hackathon_participated ? "참여" : "미참여"}
                    </TableCell>
                    <TableCell className="text-center">
                      {target.eligible ? (
                        <Badge>충족</Badge>
                      ) : (
                        <Badge variant="secondary">미달</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {target.certificate_status === 1 &&
                      target.certificate_url ? (
                        <a
                          href={target.certificate_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          발급됨 <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">미발급</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 수동 발급 다이얼로그 */}
      <Dialog
        open={manualOpen}
        onOpenChange={(open) => !open && closeManualDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>수료증 수동 발급</DialogTitle>
            <DialogDescription>
              특수한 경우(자료 누락, 과거 학기 재발행 등)를 위해 모든 정보를
              직접 입력해 발급합니다. 발급 이력은 부원 계정에 기록되지 않습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="manual-name">이름</Label>
                <Input
                  id="manual-name"
                  placeholder="홍길동"
                  value={manualForm.userName}
                  onChange={(e) =>
                    setManualForm((f) => ({ ...f, userName: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="manual-student-number">학번</Label>
                <Input
                  id="manual-student-number"
                  placeholder="2024000000"
                  value={manualForm.studentNumber}
                  onChange={(e) =>
                    setManualForm((f) => ({
                      ...f,
                      studentNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manual-department">학과</Label>
              <Input
                id="manual-department"
                placeholder="정보시스템학과"
                value={manualForm.department}
                onChange={(e) =>
                  setManualForm((f) => ({ ...f, department: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manual-study-name">스터디명</Label>
              <Input
                id="manual-study-name"
                placeholder="README.md"
                value={manualForm.studyName}
                onChange={(e) =>
                  setManualForm((f) => ({ ...f, studyName: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="manual-activity-period">활동 기간</Label>
                <Input
                  id="manual-activity-period"
                  placeholder="2026.03.02.~2026.06.20."
                  value={manualForm.activityPeriod}
                  onChange={(e) =>
                    setManualForm((f) => ({
                      ...f,
                      activityPeriod: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="manual-issue-date">발급일 (선택)</Label>
                <Input
                  id="manual-issue-date"
                  placeholder="미입력 시 오늘 날짜"
                  value={manualForm.issueDate}
                  onChange={(e) =>
                    setManualForm((f) => ({
                      ...f,
                      issueDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manual-president-name">회장 이름 (선택)</Label>
              <Input
                id="manual-president-name"
                placeholder="미입력 시 현재 회장 이름"
                value={manualForm.presidentName}
                onChange={(e) =>
                  setManualForm((f) => ({
                    ...f,
                    presidentName: e.target.value,
                  }))
                }
              />
            </div>

            {manualResultUrl && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm">
                <p className="mb-1 font-medium">수료증이 생성되었습니다</p>
                <a
                  href={manualResultUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 break-all text-blue-600 hover:underline"
                >
                  {manualResultUrl}{" "}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeManualDialog}>
              닫기
            </Button>
            <Button onClick={handleManualIssue} disabled={isManualIssuing}>
              {isManualIssuing ? "생성 중..." : "발급"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
