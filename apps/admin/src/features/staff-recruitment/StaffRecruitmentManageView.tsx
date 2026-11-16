"use client";
import { useCallback, useEffect, useState } from "react";
import { CalendarRange, Pencil, Plus, UserRoundCog } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminStaffRecruitmentRound } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentTitle, staffRecruitmentStorageTitle } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { changeStaffRecruitmentStatus, createStaffRecruitment, getStaffRecruitments, updateStaffRecruitment } from "./api";
import { toSaveRequest, type StaffRecruitmentFormState } from "./form";
import { StaffRecruitmentFormDialog } from "./StaffRecruitmentFormDialog";
import Link from "next/link";

const STATUS_LABELS = {
  DRAFT: "초안",
  PUBLISHED: "공개",
  CLOSED: "마감",
  CANCELED: "취소",
} as const;

function formatRecruitmentDate(value?: string | null) {
  return value ? value.slice(0, 10).replaceAll("-", ". ") : "-";
}

export function StaffRecruitmentManageView() {
  const [items, setItems] = useState<AdminStaffRecruitmentRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] =
    useState<AdminStaffRecruitmentRound | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getStaffRecruitments());
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (form: StaffRecruitmentFormState) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const body = toSaveRequest(form);
      if (editTarget) {
        await updateStaffRecruitment(editTarget.recruitment_id, {
          title: staffRecruitmentStorageTitle(
            editTarget.act_year,
            editTarget.act_semester,
          ),
          summary: body.summary,
          description: body.description,
          starts_at: body.starts_at,
          ends_at: body.ends_at,
          departments: body.departments,
          questions: body.questions,
          version: editTarget.version,
        });
      } else {
        await createStaffRecruitment(body);
      }
      toast.success(
        editTarget ? "모집 초안을 수정했습니다." : "모집 초안을 만들었습니다.",
      );
      setDialogOpen(false);
      setEditTarget(null);
      await load();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const runAction = async (
    recruitment: AdminStaffRecruitmentRound,
    action: "publish" | "close" | "cancel",
  ) => {
    if (submitting) return;
    const actionLabel = { publish: "공개", close: "마감", cancel: "취소" }[
      action
    ];
    if (
      !(await confirmDialog({
        title: `모집 ${actionLabel}`,
        description: `“${formatStaffRecruitmentTitle(recruitment.act_year, recruitment.act_semester)}”을 ${actionLabel}할까요?`,
        confirmLabel: actionLabel,
      }))
    ) {
      return;
    }
    setSubmitting(true);
    try {
      await changeStaffRecruitmentStatus(
        recruitment.recruitment_id,
        action,
        recruitment.version,
        action === "publish" ? undefined : `${actionLabel} 처리`,
      );
      toast.success(`모집을 ${actionLabel}했습니다.`);
      await load();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="운영진 모집"
          description="모집 정보와 지원서 문항을 설정하고 모집 기간을 정합니다."
        />
        <Button
          onClick={() => {
            setEditTarget(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" />새 모집 만들기
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground rounded-lg border p-8 text-center">
          모집 회차를 불러오는 중입니다.
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <CalendarRange className="text-muted-foreground mx-auto h-10 w-10" />
          <h2 className="mt-3 font-semibold">등록된 운영진 모집이 없습니다</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            새 모집을 만들어 안내와 접수 기간을 설정해주세요.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.recruitment_id}
              className="rounded-lg border p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">
                      {formatStaffRecruitmentTitle(
                        item.act_year,
                        item.act_semester,
                      )}
                    </h2>
                    <Badge variant="outline">
                      {STATUS_LABELS[item.publication_status]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {formatRecruitmentDate(item.starts_at)} ~{" "}
                    {formatRecruitmentDate(item.ends_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" asChild>
                    <Link
                      href={`/staff-applications?recruitmentId=${item.recruitment_id}`}
                    >
                      지원서 보기
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link
                      href={`/staff-recruitments/${item.recruitment_id}/reviewers`}
                    >
                      <UserRoundCog className="mr-1 h-4 w-4" />
                      열람자 관리
                    </Link>
                  </Button>
                  {item.publication_status === "DRAFT" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditTarget(item);
                          setDialogOpen(true);
                        }}
                        disabled={submitting}
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        수정
                      </Button>
                      <Button
                        onClick={() => runAction(item, "publish")}
                        disabled={submitting}
                      >
                        공개
                      </Button>
                    </>
                  )}
                  {item.publication_status === "PUBLISHED" && (
                    <Button
                      variant="outline"
                      onClick={() => runAction(item, "close")}
                      disabled={submitting}
                    >
                      조기 마감
                    </Button>
                  )}
                  {(item.publication_status === "DRAFT" ||
                    item.publication_status === "PUBLISHED") && (
                    <Button
                      variant="destructive"
                      onClick={() => runAction(item, "cancel")}
                      disabled={submitting}
                    >
                      취소
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <StaffRecruitmentFormDialog
        open={dialogOpen}
        recruitment={editTarget}
        submitting={submitting}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditTarget(null);
        }}
        onSubmit={save}
      />
    </div>
  );
}
