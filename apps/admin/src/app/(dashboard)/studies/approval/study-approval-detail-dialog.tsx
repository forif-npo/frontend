"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminStudyDetail } from "../api";
import type { Study } from "../types";

const WEEKDAY_LABELS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: "쉬움",
  SEMI_EASY: "조금 쉬움",
  NORMAL: "보통",
  SEMI_HARD: "조금 어려움",
  HARD: "어려움",
};

interface StudyApprovalDetailDialogProps {
  study: Study | null;
  detail: AdminStudyDetail | null;
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onApprove: (study: Study) => void;
  onReject: (study: Study) => void;
}

export function StudyApprovalDetailDialog({
  study,
  detail,
  isLoading,
  isSubmitting,
  onClose,
  onApprove,
  onReject,
}: StudyApprovalDetailDialogProps) {
  const isOpen = Boolean(study);
  const studyName = detail?.study_name ?? study?.study_name ?? "";
  const tags = detail?.tags ?? study?.tags ?? [];
  const thumbnailUrl = detail?.thumbnail_image ?? detail?.img_url;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle>스터디 개설 요청 검토</DialogTitle>
          <DialogDescription>
            개설 신청 내용을 확인한 뒤 승인 또는 반려해주세요.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-muted-foreground py-16 text-center text-sm">
            신청 정보를 불러오는 중입니다.
          </div>
        ) : detail ? (
          <div className="space-y-8">
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={`${studyName} 썸네일`}
                className="max-h-72 w-full rounded-lg border object-contain"
              />
            )}

            <ReviewSection title="스터디 개요">
              <ReviewGrid>
                <ReviewItem
                  label="멘토"
                  value={
                    [
                      detail.primary_mentor_name ?? study?.primary_mentor_name,
                      detail.secondary_mentor_name ??
                        study?.secondary_mentor_name,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"
                  }
                />
                <ReviewItem label="스터디명" value={studyName || "-"} />
                <ReviewItem
                  label="한 줄 소개"
                  value={detail.one_liner || "-"}
                />
                <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
                  <dt className="text-muted-foreground text-sm font-medium">
                    태그
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </dd>
                </div>
                <ReviewItem
                  label="난이도"
                  value={
                    detail.difficulty
                      ? (DIFFICULTY_LABELS[detail.difficulty] ??
                        detail.difficulty)
                      : "-"
                  }
                />
                <ReviewItem label="진행 시간" value={formatStudyTime(detail)} />
                <ReviewItem label="진행 장소" value={formatLocation(detail)} />
                <ReviewItem
                  label="모집 인원"
                  value={
                    detail.capacity === null || detail.capacity === undefined
                      ? "-"
                      : `${detail.capacity}명`
                  }
                />
                <ReviewItem
                  label="면접 일정"
                  value={
                    detail.requires_interview
                      ? formatDateTime(detail.interview_date)
                      : "면접 없음"
                  }
                />
              </ReviewGrid>
            </ReviewSection>

            <ReviewSection title="스터디 소개">
              <p className="bg-muted whitespace-pre-wrap rounded-lg p-4 text-sm leading-6">
                {detail.explanation || detail.goal || "-"}
              </p>
            </ReviewSection>

            <ReviewSection title="커리큘럼">
              {detail.plans && detail.plans.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="bg-muted text-muted-foreground text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium">주차</th>
                        <th className="px-4 py-3 font-medium">진행 날짜</th>
                        <th className="px-4 py-3 font-medium">주제</th>
                        <th className="px-4 py-3 font-medium">내용</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {detail.plans.map((plan) => (
                        <tr key={plan.id}>
                          <td className="px-4 py-3">{plan.week_num}주차</td>
                          <td className="px-4 py-3">{formatDate(plan.date)}</td>
                          <td className="px-4 py-3">{plan.section || "-"}</td>
                          <td className="whitespace-pre-wrap px-4 py-3">
                            {plan.content || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  등록된 커리큘럼이 없습니다.
                </p>
              )}
            </ReviewSection>

            <ReviewSection title="참고자료">
              {detail.references && detail.references.length > 0 ? (
                <ul className="space-y-2">
                  {detail.references.map((reference) => (
                    <li
                      key={reference.id}
                      className="bg-muted rounded-lg px-4 py-3 text-sm"
                    >
                      <span className="text-muted-foreground mr-2 font-medium">
                        {reference.reference_type === "FILE" ? "파일" : "링크"}
                      </span>
                      <span className="break-all">
                        {reference.content || "-"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  등록된 참고자료가 없습니다.
                </p>
              )}
            </ReviewSection>
          </div>
        ) : (
          <div className="text-destructive py-16 text-center text-sm">
            신청 정보를 불러오지 못했습니다.
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            닫기
          </Button>
          {study && detail && (
            <>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting}
                onClick={() => onReject(study)}
              >
                반려
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => onApprove(study)}
              >
                승인
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function ReviewGrid({ children }: { children: ReactNode }) {
  return <dl className="space-y-3 rounded-lg border p-4">{children}</dl>;
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-muted-foreground text-sm font-medium">{label}</dt>
      <dd className="whitespace-pre-wrap text-sm">{value}</dd>
    </div>
  );
}

function formatStudyTime(detail: AdminStudyDetail) {
  const weekDay =
    detail.week_day === null || detail.week_day === undefined
      ? ""
      : (WEEKDAY_LABELS[detail.week_day] ?? "");
  const times = [detail.start_time, detail.end_time]
    .filter(Boolean)
    .join(" ~ ");

  return [weekDay, times].filter(Boolean).join(" ") || "-";
}

function formatLocation(detail: AdminStudyDetail) {
  if (detail.is_online) return "온라인";

  return (
    [detail.location, detail.location_detail].filter(Boolean).join(" ") || "-"
  );
}

function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : "-";
}

function formatDateTime(value?: string | null) {
  if (!value) return "일정 미정";

  return value.replace("T", " ").slice(0, 16);
}
