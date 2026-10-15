"use client";

import { useCallback, useEffect, useState } from "react";
import { Award, Eye, Pencil, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminHallOfFameEntry } from "@core/types/hall-of-fame";
import { handleApiError } from "@core/utils/api-client";
import { formatDateTimeLabel } from "@/utils/datetime";
import {
  changeHallOfFamePublication,
  createHallOfFameEntry,
  getHallOfFameEntries,
  updateHallOfFameEntry,
  uploadHallOfFameImage,
} from "./api";
import { toHallOfFameSaveRequest, type HallOfFameFormState } from "./form";
import { HallOfFameFormDialog } from "./HallOfFameFormDialog";
import { HallOfFamePreview } from "./HallOfFamePreview";

const STATUS_LABELS = {
  DRAFT: "초안",
  PUBLISHED: "게시 중",
  UNPUBLISHED: "게시 중단",
} as const;

export function HallOfFameManageView() {
  const [entries, setEntries] = useState<AdminHallOfFameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminHallOfFameEntry | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [preview, setPreview] = useState<AdminHallOfFameEntry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await getHallOfFameEntries());
    } catch (loadError) {
      setError(await handleApiError(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (form: HallOfFameFormState, image: File | null) => {
    setSaving(true);
    try {
      const body = toHallOfFameSaveRequest(form);
      const saved = editing
        ? await updateHallOfFameEntry(editing.entry_id, {
            ...body,
            version: editing.version,
          })
        : await createHallOfFameEntry(body);
      if (image) await uploadHallOfFameImage(saved.entry_id, image);
      toast.success(
        editing ? "전시 콘텐츠를 수정했습니다." : "전시 초안을 저장했습니다.",
      );
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (saveError) {
      toast.error(await handleApiError(saveError));
    } finally {
      setSaving(false);
    }
  };

  const changePublication = async (entry: AdminHallOfFameEntry) => {
    const action =
      entry.publication_status === "PUBLISHED" ? "unpublish" : "publish";
    const label = action === "publish" ? "게시" : "게시 중단";
    if (!window.confirm(`${entry.name} 콘텐츠를 ${label}할까요?`)) return;
    setBusyId(entry.entry_id);
    try {
      await changeHallOfFamePublication(entry.entry_id, action, entry.version);
      toast.success(`${label} 처리했습니다.`);
      await load();
    } catch (actionError) {
      toast.error(await handleApiError(actionError));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="명예의 전당 관리"
          description="인물과 성취를 초안으로 저장하고 미리보기 후 게시합니다."
          icon={<Award className="h-7 w-7" />}
        />
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          전시 등록
        </Button>
      </div>

      {loading ? (
        <div
          className="text-muted-foreground rounded-lg border p-8 text-center"
          role="status"
        >
          전시 콘텐츠를 불러오는 중입니다.
        </div>
      ) : error ? (
        <div className="border-destructive/40 bg-destructive/5 rounded-lg border p-6 text-center">
          <p className="text-destructive">{error}</p>
          <Button className="mt-4" variant="outline" onClick={load}>
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center">
          <Award className="mx-auto mb-3 h-10 w-10" />
          <p className="text-foreground font-medium">
            등록된 전시 콘텐츠가 없습니다.
          </p>
          <p className="mt-1 text-sm">첫 콘텐츠를 초안으로 등록해보세요.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {entries.map((entry) => (
            <article
              key={entry.entry_id}
              className="space-y-4 rounded-xl border p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-lg font-bold">
                      {entry.name}
                    </h2>
                    <Badge
                      variant={
                        entry.publication_status === "PUBLISHED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {STATUS_LABELS[entry.publication_status]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground break-words text-sm">
                    {entry.semester_label} · /{entry.slug}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs">
                  순서 {entry.display_order}
                </span>
              </div>
              <div>
                <p className="font-medium">{entry.title}</p>
                <p className="text-muted-foreground mt-1 line-clamp-3 whitespace-pre-wrap text-sm">
                  {entry.introduction}
                </p>
              </div>
              <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span>성취 {entry.achievements.length}개</span>
                <span>배지 {entry.badges.length}개</span>
                <span>수정 {formatDateTimeLabel(entry.updated_at)}</span>
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPreview(entry)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  미리보기
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(entry);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  수정
                </Button>
                <Button
                  size="sm"
                  variant={
                    entry.publication_status === "PUBLISHED"
                      ? "destructive"
                      : "default"
                  }
                  disabled={busyId === entry.entry_id}
                  onClick={() => changePublication(entry)}
                >
                  {busyId === entry.entry_id
                    ? "처리 중"
                    : entry.publication_status === "PUBLISHED"
                      ? "게시 중단"
                      : "게시"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <HallOfFameFormDialog
        open={formOpen}
        entry={editing}
        saving={saving}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        onSave={save}
      />

      <DialogPreview entry={preview} onClose={() => setPreview(null)} />
    </main>
  );
}

function DialogPreview({
  entry,
  onClose,
}: {
  entry: AdminHallOfFameEntry | null;
  onClose: () => void;
}) {
  if (!entry) return null;
  const form: HallOfFameFormState = {
    userId: entry.user_id === null ? "" : String(entry.user_id),
    memberName: entry.name,
    memberDepartment: "",
    slug: entry.slug,
    actYear: String(entry.act_year),
    actSemester: String(entry.act_semester) as "1" | "2",
    title: entry.title,
    introduction: entry.introduction,
    badges: entry.badges.map((badge) => badge.label),
    achievements: entry.achievements.map((item) => ({
      title: item.title,
      description: item.description ?? "",
      linkUrl: item.link_url ?? "",
    })),
    displayOrder: String(entry.display_order),
  };
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>관리자 미리보기</DialogTitle>
          <DialogDescription>
            공개 API를 사용하지 않는 관리 화면 미리보기입니다.
          </DialogDescription>
        </DialogHeader>
        <HallOfFamePreview form={form} imageUrl={entry.image_url} />
      </DialogContent>
    </Dialog>
  );
}
