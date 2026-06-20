"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Team } from "@core/types/hackathon";
import {
  AlertTriangle,
  Check,
  Download,
  Loader2,
  Plus,
  Presentation,
  Trash2,
  Upload,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useHackathonResults } from "../hooks/use-hackathon-results";
import { createEmptyRow, parseDraft } from "../schema";
import { isPresentable } from "../slides";
import { TRACK_LABELS, TRACK_ORDER } from "../types";
import type { AwardResult, HackathonResultDraft, ResultTrack } from "../types";
import { ResultRow } from "./result-row";

interface ResultsEditorProps {
  hackathonId: number;
  eventTitle: string;
  teams: Team[];
}

function computeWarnings(results: AwardResult[]): string[] {
  const warnings: string[] = [];

  for (const track of TRACK_ORDER) {
    const rows = results.filter((r) => r.track === track && isPresentable(r));
    const label = TRACK_LABELS[track];

    const ranks = new Map<number, number>();
    const teams = new Map<string, number>();
    rows.forEach((row) => {
      if (row.rank !== null) {
        ranks.set(row.rank, (ranks.get(row.rank) ?? 0) + 1);
      }
      const key = row.teamName.trim();
      teams.set(key, (teams.get(key) ?? 0) + 1);
    });
    ranks.forEach((count, rank) => {
      if (count > 1)
        warnings.push(`${label}에 ${rank}위가 ${count}번 입력되었습니다.`);
    });
    teams.forEach((count, team) => {
      if (count > 1)
        warnings.push(`${label}에 '${team}' 팀이 ${count}번 입력되었습니다.`);
    });
  }

  // 부문 간 같은 팀 (저장은 막지 않고 경고만)
  const ideathonTeams = new Set(
    results
      .filter((r) => r.track === "IDEATHON" && isPresentable(r))
      .map((r) => r.teamName.trim()),
  );
  const crossTeams = new Set<string>();
  results.forEach((row) => {
    if (row.track === "HACKATHON" && isPresentable(row)) {
      const key = row.teamName.trim();
      if (ideathonTeams.has(key)) crossTeams.add(key);
    }
  });
  crossTeams.forEach((team) => {
    warnings.push(`'${team}' 팀이 두 부문에 모두 입력되었습니다.`);
  });

  return warnings;
}

function buildFileName(hackathonId: number): string {
  const today = new Date().toISOString().slice(0, 10);
  return `forif-hackathon-${hackathonId}-results-${today}.json`;
}

export function ResultsEditor({
  hackathonId,
  eventTitle,
  teams,
}: ResultsEditorProps) {
  const {
    draft,
    hydrated,
    saveStatus,
    loadError,
    updateDraft,
    replaceDraft,
    resetDraft,
    dismissLoadError,
  } = useHackathonResults(hackathonId, eventTitle);

  const [activeTrack, setActiveTrack] = useState<ResultTrack>("IDEATHON");
  const [clearOpen, setClearOpen] = useState(false);
  const [pendingImport, setPendingImport] =
    useState<HackathonResultDraft | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trackResults = useMemo(
    () => (draft ? draft.results.filter((r) => r.track === activeTrack) : []),
    [draft, activeTrack],
  );
  const warnings = useMemo(
    () => (draft ? computeWarnings(draft.results) : []),
    [draft],
  );
  const presentableCount = useMemo(
    () => (draft ? draft.results.filter(isPresentable).length : 0),
    [draft],
  );

  if (!hydrated || !draft) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-10 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        결과 데이터를 불러오는 중입니다.
      </div>
    );
  }

  const patchRow = (id: string, patch: Partial<AwardResult>) => {
    updateDraft((prev) => ({
      ...prev,
      results: prev.results.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const addRow = () => {
    updateDraft((prev) => ({
      ...prev,
      results: [
        ...prev.results,
        createEmptyRow(activeTrack, prev.results.length),
      ],
    }));
  };

  const deleteRow = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      results: prev.results.filter((r) => r.id !== id),
    }));
  };

  const openPresentation = () => {
    window.open(
      `/hackathon/${hackathonId}/results`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const exportJson = () => {
    try {
      const blob = new Blob([JSON.stringify(draft, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = buildFileName(hackathonId);
      a.click();
      URL.revokeObjectURL(url);
      toast.success("결과를 JSON으로 내보냈습니다.");
    } catch {
      toast.error("내보내기에 실패했습니다.");
    }
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const json: unknown = JSON.parse(text);
      const parsed = parseDraft(json);
      if (!parsed.success) {
        toast.error(parsed.error);
        return;
      }
      setPendingImport(parsed.draft);
    } catch {
      toast.error("JSON 파일을 읽을 수 없습니다.");
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    replaceDraft(pendingImport);
    setPendingImport(null);
    toast.success("결과를 불러왔습니다.");
  };

  const saveLabel: Record<typeof saveStatus, string> = {
    idle: "저장됨",
    saving: "저장 중",
    saved: "저장됨",
    error: "저장 실패",
  };

  return (
    <div className="space-y-6">
      {/* 상단 명령 영역 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm",
            saveStatus === "error"
              ? "text-destructive"
              : "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {saveStatus === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saveStatus === "error" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {saveLabel[saveStatus]}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={openPresentation} disabled={presentableCount === 0}>
            <Presentation className="mr-2 h-4 w-4" />
            발표 화면 열기
          </Button>
          <Button variant="outline" onClick={exportJson}>
            <Download className="mr-2 h-4 w-4" />
            JSON 내보내기
          </Button>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            JSON 불러오기
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            className="text-destructive"
            onClick={() => setClearOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            결과 지우기
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="border-destructive/50 text-destructive flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              저장된 결과를 복구하지 못했습니다. ({loadError}) 새 결과로
              시작합니다. 필요하면 백업 JSON을 불러오세요.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={dismissLoadError}
          >
            닫기
          </Button>
        </div>
      )}

      {warnings.length > 0 && (
        <ul className="space-y-1 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {warnings.map((warning) => (
            <li key={warning} className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {warning}
            </li>
          ))}
        </ul>
      )}

      {/* 부문 세그먼트 */}
      <div className="inline-flex rounded-md border p-1">
        {TRACK_ORDER.map((track) => (
          <button
            key={track}
            type="button"
            onClick={() => setActiveTrack(track)}
            className={cn(
              "rounded px-4 py-1.5 text-sm font-medium transition-colors",
              activeTrack === track
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {TRACK_LABELS[track]}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">
        특별상 → 낮은 순위 → 높은 순위(1위) 순서로 발표됩니다.
      </p>

      {/* 결과 목록 */}
      <div className="space-y-4">
        {trackResults.length === 0 ? (
          <div className="text-muted-foreground rounded-md border py-10 text-center text-sm">
            {TRACK_LABELS[activeTrack]} 수상 팀이 없습니다.
          </div>
        ) : (
          trackResults.map((result, index) => (
            <ResultRow
              key={result.id}
              result={result}
              index={index}
              teams={teams}
              showTeamError={
                result.teamName.trim().length === 0 && result.rank !== null
              }
              onChange={(patch) => patchRow(result.id, patch)}
              onDelete={() => deleteRow(result.id)}
            />
          ))
        )}

        <Button variant="outline" className="w-full" onClick={addRow}>
          <Plus className="mr-2 h-4 w-4" />
          {TRACK_LABELS[activeTrack]} 수상 팀 추가
        </Button>
      </div>

      {/* 결과 지우기 확인 */}
      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>결과 지우기</DialogTitle>
            <DialogDescription>
              입력한 모든 수상 팀을 지웁니다. 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetDraft();
                setClearOpen(false);
                toast.success("결과를 초기화했습니다.");
              }}
            >
              지우기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* JSON 불러오기 교체 확인 */}
      <Dialog
        open={pendingImport !== null}
        onOpenChange={(open) => {
          if (!open) setPendingImport(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>결과 불러오기</DialogTitle>
            <DialogDescription>
              현재 입력된 결과를 불러온 파일의 내용으로 교체합니다.
              {pendingImport && pendingImport.hackathonId !== hackathonId && (
                <span className="text-destructive mt-2 block">
                  파일의 해커톤 ID({pendingImport.hackathonId})가 현재 해커톤
                  ID({hackathonId})와 다릅니다.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingImport(null)}>
              취소
            </Button>
            <Button onClick={confirmImport}>불러오기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
