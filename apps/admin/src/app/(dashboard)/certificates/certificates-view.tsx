"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Award, Eraser, ExternalLink } from "lucide-react";
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
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCertificateTargets,
  getMySignature,
  issueCertificates,
  issueManualCertificate,
  searchMembers,
  uploadMySignature,
  type CertificateTargetsData,
  type IssueCertificatesData,
  type MemberSearchItem,
} from "./api";

interface ManualForm {
  userName: string;
  studentNumber: string;
  department: string;
  studyName: string;
  /** yyyy-MM-dd (date input 값) */
  startDate: string;
  endDate: string;
  issueDate: string;
  presidentName: string;
}

const EMPTY_MANUAL_FORM: ManualForm = {
  userName: "",
  studentNumber: "",
  department: "",
  studyName: "",
  startDate: "",
  endDate: "",
  issueDate: "",
  presidentName: "",
};

/** yyyy-MM-dd → 수료증 표기용 "yyyy.MM.dd." */
const toDotDate = (isoDate: string) => `${isoDate.replaceAll("-", ".")}.`;
/** yyyy-MM-dd → 발급일 표기용 "yyyy. MM. dd." */
const toIssueDate = (isoDate: string) => `${isoDate.split("-").join(". ")}.`;
/** date picker 값 ↔ 폼의 yyyy-MM-dd 문자열 변환 */
const isoToDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`) : undefined;
const dateToIso = (date: Date | undefined) =>
  date ? format(date, "yyyy-MM-dd") : "";

/** 수동 발급 작성 내용 임시저장 키 (localStorage) */
const MANUAL_DRAFT_KEY = "forif-admin-manual-cert-draft";

/** 서명 합성 영역 비율(115:52)에 맞춘 미리보기/내보내기 크기 */
const SIG_PREVIEW_W = 460;
const SIG_PREVIEW_H = 208;
const SIG_EXPORT_W = 1150;
const SIG_EXPORT_H = 520;

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
  // 일괄 발급 활동 기간 (yyyy-MM-dd, 수료증에는 yyyy.MM.dd.~yyyy.MM.dd.로 표기)
  const [batchStartDate, setBatchStartDate] = useState("");
  const [batchEndDate, setBatchEndDate] = useState("");
  const [lastResult, setLastResult] = useState<IssueCertificatesData | null>(
    null,
  );

  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState<ManualForm>(EMPTY_MANUAL_FORM);
  const [manualResultUrl, setManualResultUrl] = useState<string | null>(null);
  const [isManualIssuing, setIsManualIssuing] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // 수동 발급 중간저장: 작성 내용을 localStorage에 보존해 창을 닫아도 유지
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MANUAL_DRAFT_KEY);
      if (raw) {
        setManualForm({ ...EMPTY_MANUAL_FORM, ...JSON.parse(raw) });
        setHasDraft(true);
      }
    } catch {
      // 저장본이 깨졌으면 무시
    }
  }, []);

  useEffect(() => {
    const isEmpty = Object.values(manualForm).every((v) => !v);
    const timer = setTimeout(() => {
      if (isEmpty) {
        localStorage.removeItem(MANUAL_DRAFT_KEY);
        setHasDraft(false);
      } else {
        localStorage.setItem(MANUAL_DRAFT_KEY, JSON.stringify(manualForm));
        setHasDraft(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [manualForm]);

  const resetManualForm = () => {
    setManualForm(EMPTY_MANUAL_FORM);
    setManualResultUrl(null);
    localStorage.removeItem(MANUAL_DRAFT_KEY);
    setHasDraft(false);
  };

  const [memberQuery, setMemberQuery] = useState("");
  const [memberResults, setMemberResults] = useState<MemberSearchItem[]>([]);
  const [isMemberSearching, setIsMemberSearching] = useState(false);

  const handleMemberSearch = async () => {
    const query = memberQuery.trim();
    if (!query || isMemberSearching) return;
    setIsMemberSearching(true);
    try {
      const results = await searchMembers(query);
      setMemberResults(results);
      if (results.length === 0) {
        toast.info("검색 결과가 없습니다.");
      }
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsMemberSearching(false);
    }
  };

  const applyMember = (member: MemberSearchItem) => {
    setManualForm((f) => ({
      ...f,
      userName: member.user_name,
      studentNumber: String(member.user_id),
      department: member.department ?? "",
      studyName: member.current_study_name ?? f.studyName,
    }));
    setMemberResults([]);
    setMemberQuery("");
  };

  const [forceWarnOpen, setForceWarnOpen] = useState(false);

  const [signatureOpen, setSignatureOpen] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isSignatureLoading, setIsSignatureLoading] = useState(false);
  const [isSignatureUploading, setIsSignatureUploading] = useState(false);

  const [sigTab, setSigTab] = useState<"upload" | "draw">("upload");
  const [sigScale, setSigScale] = useState(100);
  const [uploadedSigImage, setUploadedSigImage] =
    useState<HTMLImageElement | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  /** 소스(업로드 이미지 or 그린 캔버스)를 배율 적용해 대상 캔버스 중앙에 렌더링 */
  const renderSignatureTo = useCallback(
    (canvas: HTMLCanvasElement | null, scalePercent: number) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const source =
        sigTab === "draw" ? drawCanvasRef.current : uploadedSigImage;
      if (!source || (sigTab === "draw" && !hasDrawn)) return;

      const sourceW =
        source instanceof HTMLImageElement ? source.naturalWidth : source.width;
      const sourceH =
        source instanceof HTMLImageElement
          ? source.naturalHeight
          : source.height;
      if (!sourceW || !sourceH) return;

      const fit =
        Math.min(canvas.width / sourceW, canvas.height / sourceH) *
        (scalePercent / 100);
      const w = sourceW * fit;
      const h = sourceH * fit;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        source,
        (canvas.width - w) / 2,
        (canvas.height - h) / 2,
        w,
        h,
      );
    },
    [sigTab, uploadedSigImage, hasDrawn],
  );

  const renderSigPreview = useCallback(() => {
    renderSignatureTo(previewCanvasRef.current, sigScale);
  }, [renderSignatureTo, sigScale]);

  useEffect(() => {
    renderSigPreview();
  }, [renderSigPreview, signatureOpen]);

  const openSignatureDialog = async () => {
    setSignatureOpen(true);
    setUploadedSigImage(null);
    setHasDrawn(false);
    setSigScale(100);
    setSigTab("upload");
    setIsSignatureLoading(true);
    try {
      setSignatureUrl(await getMySignature());
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSignatureLoading(false);
    }
  };

  const handleSignatureFileChange = (file: File | null) => {
    if (!file) {
      setUploadedSigImage(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setUploadedSigImage(image);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      toast.error("이미지를 읽을 수 없습니다.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  // 직접 그리기 (마우스/터치)
  const drawPointAt = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleDrawStart = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = drawPointAt(event);
    const ctx = drawCanvasRef.current?.getContext("2d");
    if (!point || !ctx) return;
    isDrawingRef.current = true;
    drawCanvasRef.current?.setPointerCapture(event.pointerId);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const handleDrawMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const point = drawPointAt(event);
    const ctx = drawCanvasRef.current?.getContext("2d");
    if (!point || !ctx) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    if (!hasDrawn) setHasDrawn(true);
  };

  const handleDrawEnd = () => {
    isDrawingRef.current = false;
    renderSigPreview();
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSignatureUpload = async () => {
    if (isSignatureUploading) return;
    const hasSource = sigTab === "draw" ? hasDrawn : !!uploadedSigImage;
    if (!hasSource) {
      toast.error(
        sigTab === "draw"
          ? "서명을 먼저 그려주세요."
          : "서명 이미지 파일을 선택해주세요.",
      );
      return;
    }

    setIsSignatureUploading(true);
    try {
      // 배율이 반영된 고해상도 PNG로 내보내기
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = SIG_EXPORT_W;
      exportCanvas.height = SIG_EXPORT_H;
      renderSignatureTo(exportCanvas, sigScale);

      const blob = await new Promise<Blob | null>((resolve) =>
        exportCanvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("서명 이미지를 생성하지 못했습니다.");

      const url = await uploadMySignature(
        new File([blob], "signature.png", { type: "image/png" }),
      );
      setSignatureUrl(url);
      setUploadedSigImage(null);
      clearDrawing();
      toast.success("서명이 등록되었습니다.");
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSignatureUploading(false);
    }
  };

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

  // 선택된 대상 중 자격 미달자
  const ineligibleSelected = (targetsData?.targets ?? []).filter(
    (t) => selectedIds.has(t.user_id) && !t.eligible,
  );

  const executeIssue = async (ignoreEligibility: boolean) => {
    if (selectedStudyId == null || isIssuing) return;
    setForceWarnOpen(false);
    setIsIssuing(true);
    try {
      const result = await issueCertificates(
        selectedStudyId,
        Array.from(selectedIds),
        `${toDotDate(batchStartDate)}~${toDotDate(batchEndDate)}`,
        ignoreEligibility,
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

  const handleIssue = async () => {
    if (selectedStudyId == null || selectedIds.size === 0 || isIssuing) return;
    if (!batchStartDate || !batchEndDate) {
      toast.error("활동 기간(시작일·종료일)을 선택해주세요.");
      return;
    }
    if (batchStartDate > batchEndDate) {
      toast.error("활동 시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }

    // 자격 미달자가 포함돼 있으면 경고 모달로 안내 후 진행
    if (ineligibleSelected.length > 0) {
      setForceWarnOpen(true);
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedIds.size}명의 수료증을 발급할까요?\n이미 발급된 부원은 재발급됩니다.`,
      )
    ) {
      return;
    }
    await executeIssue(false);
  };

  const handleManualIssue = async () => {
    if (isManualIssuing) return;
    const required: [string, string][] = [
      [manualForm.userName, "이름"],
      [manualForm.studentNumber, "학번"],
      [manualForm.department, "학과"],
      [manualForm.studyName, "스터디명"],
      [manualForm.startDate, "활동 시작일"],
      [manualForm.endDate, "활동 종료일"],
    ];
    const missing = required.find(([value]) => !value.trim());
    if (missing) {
      toast.error(`${missing[1]}을(를) 입력해주세요.`);
      return;
    }
    if (manualForm.startDate > manualForm.endDate) {
      toast.error("활동 시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }

    setIsManualIssuing(true);
    try {
      const url = await issueManualCertificate({
        user_name: manualForm.userName.trim(),
        student_number: manualForm.studentNumber.trim(),
        department: manualForm.department.trim(),
        study_name: manualForm.studyName.trim(),
        activity_period: `${toDotDate(manualForm.startDate)}~${toDotDate(manualForm.endDate)}`,
        issue_date: manualForm.issueDate
          ? toIssueDate(manualForm.issueDate)
          : undefined,
        president_name: manualForm.presidentName.trim() || undefined,
      });
      setManualResultUrl(url);
      toast.success("수료증이 생성되었습니다.");
      // 발급이 끝났으므로 임시저장 제거 (결과 URL은 다이얼로그에 유지)
      localStorage.removeItem(MANUAL_DRAFT_KEY);
      setHasDraft(false);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsManualIssuing(false);
    }
  };

  // 작성 내용은 임시저장으로 보존하고, 검색 상태만 정리한다
  const closeManualDialog = () => {
    setManualOpen(false);
    setManualResultUrl(null);
    setMemberQuery("");
    setMemberResults([]);
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
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={openSignatureDialog}>
            서명 등록
          </Button>
          <Button variant="outline" onClick={() => setManualOpen(true)}>
            수동 발급
          </Button>
        </div>
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
          <div className="flex items-center gap-2">
            <SingleDayPicker
              className="w-[160px]"
              placeholder="시작일 선택"
              labelVariant="yyyy. MM. dd."
              value={isoToDate(batchStartDate)}
              onSelect={(date) => setBatchStartDate(dateToIso(date))}
            />
            <span className="text-muted-foreground">~</span>
            <SingleDayPicker
              className="w-[160px]"
              placeholder="종료일 선택"
              labelVariant="yyyy. MM. dd."
              value={isoToDate(batchEndDate)}
              onSelect={(date) => setBatchEndDate(dateToIso(date))}
            />
          </div>
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

      {/* 자격 미달자 강제 발급 경고 모달 */}
      <Dialog
        open={forceWarnOpen}
        onOpenChange={(open) => !open && setForceWarnOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              자격 미달자가 포함되어 있습니다
            </DialogTitle>
            <DialogDescription>
              아래 {ineligibleSelected.length}명은 수료 기준(출석{" "}
              {targetsData?.required_attendance ?? 5}회 이상 + 해당 학기 해커톤
              참여)을 충족하지 못했습니다. 그래도 발급하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
            <ul className="flex flex-col gap-1">
              {ineligibleSelected.map((t) => (
                <li key={t.user_id}>
                  <span className="font-medium">{t.user_name}</span> (
                  {t.user_id}) —{" "}
                  {[
                    t.attendance_count < (targetsData?.required_attendance ?? 5)
                      ? `출석 ${t.attendance_count}/${targetsData?.required_attendance ?? 5}회`
                      : null,
                    !t.hackathon_participated ? "해커톤 미참여" : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-muted-foreground text-sm">
            발급 시 자격 충족자와 동일하게 수료증이 생성되고 부원 계정에
            기록됩니다. 선택 {selectedIds.size}명 전원이 발급 대상입니다.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForceWarnOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => executeIssue(true)}
              disabled={isIssuing}
            >
              {isIssuing ? "발급 중..." : "무시하고 발급"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 서명 등록 다이얼로그 */}
      <Dialog
        open={signatureOpen}
        onOpenChange={(open) => !open && setSignatureOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>수료증 서명 등록</DialogTitle>
            <DialogDescription>
              로그인한 본인 계정에 서명 이미지를 등록합니다. 수료증에는 발급
              시점의{" "}
              <span className="font-medium">회장 계정에 등록된 서명</span>이
              합성되며, 회장 서명이 없으면 발급이 차단됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>현재 등록된 서명</Label>
              {isSignatureLoading ? (
                <p className="text-muted-foreground text-sm">불러오는 중...</p>
              ) : signatureUrl ? (
                <div className="rounded-md border bg-gray-50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={signatureUrl}
                    alt="등록된 서명"
                    className="mx-auto max-h-16 object-contain"
                  />
                </div>
              ) : (
                <p className="text-destructive text-sm">
                  등록된 서명이 없습니다.
                </p>
              )}
            </div>

            <Tabs
              value={sigTab}
              onValueChange={(v) => setSigTab(v as "upload" | "draw")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="upload" className="flex-1">
                  파일 업로드
                </TabsTrigger>
                <TabsTrigger value="draw" className="flex-1">
                  직접 그리기
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signature-file">
                    서명 이미지 (투명 배경 PNG 권장, 흰 배경은 자동 제거)
                  </Label>
                  <Input
                    id="signature-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) =>
                      handleSignatureFileChange(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </TabsContent>
              <TabsContent value="draw" className="mt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label>마우스/터치로 서명을 그려주세요</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearDrawing}
                      disabled={!hasDrawn}
                    >
                      <Eraser className="mr-1 h-3.5 w-3.5" />
                      지우기
                    </Button>
                  </div>
                  <canvas
                    ref={drawCanvasRef}
                    width={SIG_PREVIEW_W}
                    height={SIG_PREVIEW_H}
                    className="w-full cursor-crosshair touch-none rounded-md border bg-white"
                    onPointerDown={handleDrawStart}
                    onPointerMove={handleDrawMove}
                    onPointerUp={handleDrawEnd}
                    onPointerLeave={handleDrawEnd}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signature-scale">크기 조절</Label>
                <span className="text-muted-foreground text-xs">
                  {sigScale}%
                </span>
              </div>
              <input
                id="signature-scale"
                type="range"
                min={30}
                max={100}
                step={5}
                value={sigScale}
                onChange={(e) => setSigScale(Number(e.target.value))}
                className="accent-primary w-full"
              />
              <Label className="text-muted-foreground text-xs font-normal">
                합성 미리보기 (수료증 우하단 서명 영역 기준)
              </Label>
              <canvas
                ref={previewCanvasRef}
                width={SIG_PREVIEW_W}
                height={SIG_PREVIEW_H}
                className="w-full rounded-md border border-dashed bg-gray-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignatureOpen(false)}>
              닫기
            </Button>
            <Button
              onClick={handleSignatureUpload}
              disabled={
                isSignatureUploading ||
                (sigTab === "draw" ? !hasDrawn : !uploadedSigImage)
              }
            >
              {isSignatureUploading ? "업로드 중..." : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            {/* 부원 검색으로 이름/학번/학과/스터디명 자동 채움 */}
            <div className="flex flex-col gap-2 rounded-md border bg-gray-50 p-3">
              <Label htmlFor="manual-member-search">
                부원 검색 (이름 또는 학번으로 자동 채움)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="manual-member-search"
                  placeholder="홍길동 또는 2024000000"
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleMemberSearch();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMemberSearch}
                  disabled={isMemberSearching}
                >
                  {isMemberSearching ? "검색 중..." : "검색"}
                </Button>
              </div>
              {memberResults.length > 0 && (
                <ul className="flex flex-col divide-y rounded-md border bg-white">
                  {memberResults.map((member) => (
                    <li key={member.user_id}>
                      <button
                        type="button"
                        className="hover:bg-accent w-full px-3 py-2 text-left text-sm"
                        onClick={() => applyMember(member)}
                      >
                        <span className="font-medium">{member.user_name}</span>{" "}
                        ({member.user_id}) · {member.department ?? "학과 없음"}
                        {member.current_study_name && (
                          <span className="text-muted-foreground">
                            {" "}
                            · {member.current_study_name}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="manual-start-date">활동 시작일</Label>
                <SingleDayPicker
                  id="manual-start-date"
                  placeholder="시작일 선택"
                  labelVariant="yyyy. MM. dd."
                  value={isoToDate(manualForm.startDate)}
                  onSelect={(date) =>
                    setManualForm((f) => ({ ...f, startDate: dateToIso(date) }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="manual-end-date">활동 종료일</Label>
                <SingleDayPicker
                  id="manual-end-date"
                  placeholder="종료일 선택"
                  labelVariant="yyyy. MM. dd."
                  value={isoToDate(manualForm.endDate)}
                  onSelect={(date) =>
                    setManualForm((f) => ({ ...f, endDate: dateToIso(date) }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="manual-issue-date">발급일 (선택)</Label>
                <SingleDayPicker
                  id="manual-issue-date"
                  placeholder="미선택 시 오늘"
                  labelVariant="yyyy. MM. dd."
                  value={isoToDate(manualForm.issueDate)}
                  onSelect={(date) =>
                    setManualForm((f) => ({ ...f, issueDate: dateToIso(date) }))
                  }
                />
              </div>
            </div>
            <p className="text-muted-foreground -mt-2 text-xs">
              수료증에는 &ldquo;
              {manualForm.startDate
                ? toDotDate(manualForm.startDate)
                : "yyyy.mm.dd."}
              ~
              {manualForm.endDate
                ? toDotDate(manualForm.endDate)
                : "yyyy.mm.dd."}
              &rdquo; 형식으로 표기됩니다. 발급일 미선택 시 오늘 날짜로
              표기됩니다.
            </p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manual-president-name">회장 이름 (선택)</Label>
              <Input
                id="manual-president-name"
                placeholder="미입력 시 현재 회장 이름 + 서명"
                value={manualForm.presidentName}
                onChange={(e) =>
                  setManualForm((f) => ({
                    ...f,
                    presidentName: e.target.value,
                  }))
                }
              />
              <p className="text-muted-foreground text-xs">
                현재 회장과 다른 이름을 입력하면(과거 학기 재발행용) 서명 없이
                생성됩니다.
              </p>
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
            {hasDraft && (
              <span className="text-muted-foreground mr-auto self-center text-xs">
                작성 내용이 자동 저장됩니다 (창을 닫아도 유지)
              </span>
            )}
            <Button
              variant="ghost"
              onClick={resetManualForm}
              disabled={isManualIssuing}
            >
              초기화
            </Button>
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
