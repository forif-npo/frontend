"use client";

import type { ReactNode } from "react";
import { toFileDownloadUrl } from "@core/utils/file-download";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminStudyDetail } from "../api";
import { getStudyTagLabel } from "../constants";
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
  showReviewActions: boolean;
  onClose: () => void;
  onApprove: (study: Study) => void;
  onReject: (study: Study) => void;
}

export function StudyApprovalDetailDialog({
  study,
  detail,
  isLoading,
  isSubmitting,
  showReviewActions,
  onClose,
  onApprove,
  onReject,
}: StudyApprovalDetailDialogProps) {
  const isOpen = Boolean(study);
  const studyName = detail?.study_name ?? study?.study_name ?? "";
  const tags = detail?.tags ?? study?.tags ?? [];
  const thumbnailUrl = detail?.thumbnail_image;

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
          <div className="flex flex-col gap-10">
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={`${studyName} 썸네일`}
                className="max-h-72 w-full rounded-lg border object-contain"
              />
            )}

            <ReviewSection title="스터디 개요">
              <Table>
                <TableBody className="divide-border divide-y">
                  <PreviewInfoRow
                    label="멘토"
                    value={
                      [
                        detail.primary_mentor_name ??
                          study?.primary_mentor_name,
                        detail.secondary_mentor_name ??
                          study?.secondary_mentor_name,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"
                    }
                  />
                  <PreviewInfoRow label="스터디명" value={studyName || "-"} />
                  <PreviewInfoRow
                    label="한 줄 소개"
                    value={detail.one_liner || "-"}
                  />
                  <TableRow>
                    <TableCell className="text-text-subtle w-[100px] whitespace-nowrap py-3 pr-3 text-[15px] font-bold leading-[1.5] md:w-[140px] md:text-[17px]">
                      태그
                    </TableCell>
                    <TableCell className="py-3">
                      {tags.length > 0 ? (
                        <span className={PREVIEW_VALUE_CLASS}>
                          {tags.map(getStudyTagLabel).join(", ")}
                        </span>
                      ) : (
                        <EmptyValue />
                      )}
                    </TableCell>
                  </TableRow>
                  <PreviewInfoRow
                    label="난이도"
                    value={
                      detail.difficulty
                        ? (DIFFICULTY_LABELS[detail.difficulty] ??
                          detail.difficulty)
                        : "-"
                    }
                  />
                  <PreviewInfoRow
                    label="강의시간"
                    value={formatStudyTime(detail)}
                  />
                  <PreviewInfoRow label="장소" value={formatLocation(detail)} />
                  <PreviewInfoRow
                    label="면접 여부"
                    value={
                      detail.requires_interview
                        ? `있음 (${formatDateTime(detail.interview_date)})`
                        : "없음"
                    }
                  />
                </TableBody>
              </Table>
            </ReviewSection>

            <ReviewSection title="스터디 소개">
              <p className="text-text-basic bg-surface-gray-subtler whitespace-pre-wrap rounded-xl p-4 text-[15px] leading-[1.5] md:p-6 md:text-[17px]">
                {detail.explanation || detail.goal || "-"}
              </p>
            </ReviewSection>

            <ReviewSection title="커리큘럼">
              {detail.plans && detail.plans.length > 0 ? (
                <CurriculumReviewTable plans={detail.plans} />
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
                      className="bg-muted flex items-start gap-3 rounded-lg px-4 py-3 text-sm"
                    >
                      <span className="text-muted-foreground mr-2 font-medium">
                        {reference.reference_type === "FILE" ? "파일" : "링크"}
                      </span>
                      <ReferenceContent reference={reference} />
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
          {study && detail && showReviewActions && (
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

function CurriculumReviewTable({
  plans,
}: {
  plans: NonNullable<AdminStudyDetail["plans"]>;
}) {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-[640px] table-fixed border-collapse">
        <colgroup>
          <col className="w-[60px]" />
          <col className="w-[120px]" />
          <col className="w-[240px]" />
          <col />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className={CURRICULUM_HEADER_CELL_CLASS}>주차</TableHead>
            <TableHead className={CURRICULUM_HEADER_CELL_CLASS}>
              진행 날짜
            </TableHead>
            <TableHead className={CURRICULUM_HEADER_CELL_CLASS}>주제</TableHead>
            <TableHead className={CURRICULUM_HEADER_CELL_CLASS}>내용</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans
            .slice()
            .sort((first, second) => first.week_num - second.week_num)
            .map((plan) => {
              const contents = splitPlanContent(plan.content);

              return contents.map((content, contentIndex) => (
                <TableRow key={`${plan.id}-${contentIndex}`}>
                  {contentIndex === 0 && (
                    <>
                      <TableCell
                        rowSpan={contents.length}
                        className={`${CURRICULUM_BODY_CELL_CLASS} text-center`}
                      >
                        {plan.week_num}주차
                      </TableCell>
                      <TableCell
                        rowSpan={contents.length}
                        className={`${CURRICULUM_BODY_CELL_CLASS} whitespace-nowrap`}
                      >
                        {formatDate(plan.date)}
                      </TableCell>
                      <TableCell
                        rowSpan={contents.length}
                        className={`${CURRICULUM_BODY_CELL_CLASS} break-words`}
                      >
                        {plan.section || "-"}
                      </TableCell>
                    </>
                  )}
                  <TableCell
                    className={`${CURRICULUM_BODY_CELL_CLASS} whitespace-pre-wrap break-words`}
                  >
                    {content}
                  </TableCell>
                </TableRow>
              ));
            })}
        </TableBody>
      </Table>
    </div>
  );
}

function splitPlanContent(content: string | null) {
  const contents = content
    ?.split("; ")
    .map((item) => item.trim())
    .filter(Boolean);

  return contents && contents.length > 0 ? contents : ["-"];
}

function ReferenceContent({
  reference,
}: {
  reference: NonNullable<AdminStudyDetail["references"]>[number];
}) {
  const safeContentUrl = getSafeExternalUrl(reference.content);
  const href =
    reference.reference_type === "FILE" && safeContentUrl
      ? toFileDownloadUrl(safeContentUrl)
      : safeContentUrl;

  if (href) {
    return (
      <a
        href={href}
        download={reference.reference_type === "FILE" || undefined}
        target={reference.reference_type === "URL" ? "_blank" : undefined}
        rel={reference.reference_type === "URL" ? "noreferrer" : undefined}
        className="text-primary break-all underline underline-offset-2"
      >
        {reference.file_name ?? reference.content}
      </a>
    );
  }

  return <span className="break-all">{reference.content || "-"}</span>;
}

function getSafeExternalUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function PreviewInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <TableRow>
      <TableCell className="text-text-subtle w-[100px] whitespace-nowrap py-3 pr-3 text-[15px] font-bold leading-[1.5] md:w-[140px] md:text-[17px]">
        {label}
      </TableCell>
      <TableCell className={`py-3 ${PREVIEW_VALUE_CLASS}`}>{value}</TableCell>
    </TableRow>
  );
}

function EmptyValue() {
  return <span className="text-text-subtle">-</span>;
}

const CURRICULUM_HEADER_CELL_CLASS =
  "border-b border-secondary-10 bg-secondary-5 px-2 py-2 text-left text-[15px] font-bold leading-[1.5] text-text-bolder";
const CURRICULUM_BODY_CELL_CLASS =
  "border-border-gray-light border-b bg-surface-white px-2 py-2 align-top text-[15px] leading-[1.5] text-text-basic";
const PREVIEW_VALUE_CLASS = "text-text-basic text-[15px] leading-[1.5]";

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
