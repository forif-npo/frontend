"use client";

import { useEffect, useState } from "react";
import { Eye, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminHallOfFameEntry,
  HallOfFameMemberCandidate,
} from "@core/types/hall-of-fame";
import { handleApiError } from "@core/utils/api-client";
import { searchHallOfFameMembers } from "./api";
import {
  emptyHallOfFameForm,
  hallOfFameEntryToForm,
  validateHallOfFameForm,
  type HallOfFameFormState,
} from "./form";
import { HallOfFamePreview } from "./HallOfFamePreview";

interface HallOfFameFormDialogProps {
  open: boolean;
  entry: AdminHallOfFameEntry | null;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (form: HallOfFameFormState, image: File | null) => Promise<void>;
}

export function HallOfFameFormDialog({
  open,
  entry,
  saving,
  onOpenChange,
  onSave,
}: HallOfFameFormDialogProps) {
  const [form, setForm] = useState(emptyHallOfFameForm);
  const [memberSearch, setMemberSearch] = useState("");
  const [members, setMembers] = useState<HallOfFameMemberCandidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(entry ? hallOfFameEntryToForm(entry) : emptyHallOfFameForm());
    setMemberSearch("");
    setMembers([]);
    setImage(null);
    setPreviewing(false);
  }, [entry, open]);

  const patchForm = (patch: Partial<HallOfFameFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const searchMembers = async () => {
    if (!memberSearch.trim()) {
      toast.error("회원 이름 또는 학번을 입력해주세요.");
      return;
    }
    setSearching(true);
    try {
      setMembers(await searchHallOfFameMembers(memberSearch));
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSearching(false);
    }
  };

  const submit = async () => {
    const error = validateHallOfFameForm(form);
    if (error) {
      toast.error(error);
      return;
    }
    await onSave(form, image);
  };

  const addBadge = () => {
    if (form.badges.length >= 10) return;
    patchForm({ badges: [...form.badges, ""] });
  };

  const updateBadge = (index: number, value: string) => {
    const badges = [...form.badges];
    badges[index] = value;
    patchForm({ badges });
  };

  const updateAchievement = (
    index: number,
    patch: Partial<HallOfFameFormState["achievements"][number]>,
  ) => {
    const achievements = [...form.achievements];
    achievements[index] = { ...achievements[index], ...patch };
    patchForm({ achievements });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entry ? "전시 콘텐츠 수정" : "전시 콘텐츠 등록"}
          </DialogTitle>
          <DialogDescription>
            저장하면 초안이 됩니다. 게시 전 미리보기에서 이름·긴 소개·사진 없는
            상태를 확인하세요.
          </DialogDescription>
        </DialogHeader>

        {previewing ? (
          <HallOfFamePreview form={form} imageUrl={entry?.image_url} />
        ) : (
          <div className="space-y-7 py-2">
            <section className="space-y-3" aria-labelledby="member-heading">
              <div>
                <h3 id="member-heading" className="font-semibold">
                  전시 인물
                </h3>
                <p className="text-muted-foreground text-sm">
                  기존 회원을 검색해 연결합니다.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  aria-label="회원 검색"
                  value={memberSearch}
                  placeholder="이름 또는 학번"
                  onChange={(event) => setMemberSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void searchMembers();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={searchMembers}
                  disabled={searching}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {searching ? "검색 중" : "검색"}
                </Button>
              </div>
              {form.userId && (
                <div className="bg-muted/50 rounded-lg border p-3 text-sm">
                  선택됨: <strong>{form.memberName}</strong> ({form.userId})
                  {form.memberDepartment && ` · ${form.memberDepartment}`}
                </div>
              )}
              {members.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {members.map((member) => (
                    <Button
                      key={member.user_id}
                      type="button"
                      variant={
                        form.userId === String(member.user_id)
                          ? "default"
                          : "outline"
                      }
                      className="h-auto justify-start whitespace-normal py-3 text-left"
                      onClick={() =>
                        patchForm({
                          userId: String(member.user_id),
                          memberName: member.user_name,
                          memberDepartment: member.department ?? "",
                        })
                      }
                    >
                      <span>
                        {member.user_name} ({member.user_id})
                        {member.department && (
                          <span className="block text-xs opacity-75">
                            {member.department}
                          </span>
                        )}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </section>

            <section
              className="grid gap-4 sm:grid-cols-2"
              aria-label="기본 정보"
            >
              <Field label="slug" htmlFor="hall-slug">
                <Input
                  id="hall-slug"
                  value={form.slug}
                  placeholder="lowercase-slug"
                  onChange={(event) =>
                    patchForm({ slug: event.target.value.toLowerCase() })
                  }
                />
              </Field>
              <Field label="전시 제목" htmlFor="hall-title">
                <Input
                  id="hall-title"
                  value={form.title}
                  onChange={(event) => patchForm({ title: event.target.value })}
                />
              </Field>
              <Field label="활동 연도" htmlFor="hall-year">
                <Input
                  id="hall-year"
                  type="number"
                  min="2000"
                  max="2100"
                  value={form.actYear}
                  onChange={(event) =>
                    patchForm({ actYear: event.target.value })
                  }
                />
              </Field>
              <Field label="활동 학기" htmlFor="hall-semester">
                <Select
                  value={form.actSemester}
                  onValueChange={(value) =>
                    patchForm({ actSemester: value as "1" | "2" })
                  }
                >
                  <SelectTrigger id="hall-semester">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1학기</SelectItem>
                    <SelectItem value="2">2학기</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="노출 순서" htmlFor="hall-order">
                <Input
                  id="hall-order"
                  type="number"
                  min="0"
                  value={form.displayOrder}
                  onChange={(event) =>
                    patchForm({ displayOrder: event.target.value })
                  }
                />
              </Field>
              <Field label="대표 이미지" htmlFor="hall-image">
                <Input
                  id="hall-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const selected = event.target.files?.[0] ?? null;
                    if (selected && selected.size > 5 * 1024 * 1024) {
                      toast.error("이미지는 5MB 이하만 등록할 수 있습니다.");
                      event.target.value = "";
                      return;
                    }
                    setImage(selected);
                  }}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="소개" htmlFor="hall-introduction">
                  <Textarea
                    id="hall-introduction"
                    rows={6}
                    value={form.introduction}
                    onChange={(event) =>
                      patchForm({ introduction: event.target.value })
                    }
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-3" aria-labelledby="badge-heading">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 id="badge-heading" className="font-semibold">
                    배지
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    최대 10개, 각 30자
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addBadge}
                  disabled={form.badges.length >= 10}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  배지 추가
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {form.badges.map((badge, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      aria-label={`배지 ${index + 1}`}
                      maxLength={30}
                      value={badge}
                      onChange={(event) =>
                        updateBadge(index, event.target.value)
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`배지 ${index + 1} 삭제`}
                      onClick={() =>
                        patchForm({
                          badges: form.badges.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="space-y-3"
              aria-labelledby="achievement-heading"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 id="achievement-heading" className="font-semibold">
                    주요 성취
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    최대 20개 · 링크는 https만 허용
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={form.achievements.length >= 20}
                  onClick={() =>
                    patchForm({
                      achievements: [
                        ...form.achievements,
                        { title: "", description: "", linkUrl: "" },
                      ],
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  성취 추가
                </Button>
              </div>
              <div className="space-y-3">
                {form.achievements.map((achievement, index) => (
                  <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm">성취 {index + 1}</strong>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`성취 ${index + 1} 삭제`}
                        onClick={() =>
                          patchForm({
                            achievements: form.achievements.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      aria-label={`성취 ${index + 1} 제목`}
                      placeholder="제목"
                      value={achievement.title}
                      onChange={(event) =>
                        updateAchievement(index, { title: event.target.value })
                      }
                    />
                    <Textarea
                      aria-label={`성취 ${index + 1} 설명`}
                      placeholder="설명 (선택)"
                      value={achievement.description}
                      onChange={(event) =>
                        updateAchievement(index, {
                          description: event.target.value,
                        })
                      }
                    />
                    <Input
                      aria-label={`성취 ${index + 1} 링크`}
                      type="url"
                      placeholder="https://... (선택)"
                      value={achievement.linkUrl}
                      onChange={(event) =>
                        updateAchievement(index, {
                          linkUrl: event.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewing((value) => !value)}
            disabled={saving}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewing ? "편집으로 돌아가기" : "미리보기"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            취소
          </Button>
          <Button type="button" onClick={submit} disabled={saving}>
            {saving ? "저장 중..." : "초안 저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
