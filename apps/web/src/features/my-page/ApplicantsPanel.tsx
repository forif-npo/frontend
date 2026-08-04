"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Pagination, Select } from "@ui/components/client";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type BadgeProps,
} from "@ui/components/server";
import {
  getApplicants,
  getApplicationDetail,
  acceptApplications,
  rejectApplications,
  type Applicant,
  type ApplicantsPage,
  type ApplyStatusFilter,
} from "@core/study-manage/api";

interface ApplicantsPanelProps {
  studyId: number;
}

const PAGE_SIZE = 10;

const statusBadgeVariant: Record<string, NonNullable<BadgeProps["variant"]>> = {
  대기중: "warning",
  승낙: "success",
  거절: "danger",
};

function formatApplyDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function ApplicantsPanel({ studyId }: ApplicantsPanelProps) {
  const [statusFilter, setStatusFilter] = useState<ApplyStatusFilter | "ALL">(
    "ALL",
  );
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");
  const [page, setPage] = useState(0);

  const [applicantsPage, setApplicantsPage] = useState<ApplicantsPage>({
    total_pages: 0,
    total_elements: 0,
    content: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailCache, setDetailCache] = useState<Record<number, string>>({});

  const fetchApplicants = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getApplicants(studyId, {
        page,
        pageSize: PAGE_SIZE,
        statusFilter: statusFilter === "ALL" ? undefined : statusFilter,
        applyDateDirection: sortOrder,
      });
      setApplicantsPage(data);
    } catch {
      setErrorMessage("신청자 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [studyId, page, statusFilter, sortOrder]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  // 스터디가 바뀌면 목록 상태 초기화
  useEffect(() => {
    setPage(0);
    setSelectedIds(new Set());
    setExpandedId(null);
    setDetailCache({});
  }, [studyId]);

  const resetListState = () => {
    setPage(0);
    setSelectedIds(new Set());
    setExpandedId(null);
  };

  const toggleSelect = (applyId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(applyId)) {
        next.delete(applyId);
      } else {
        next.add(applyId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === applicantsPage.content.length
        ? new Set()
        : new Set(applicantsPage.content.map((a) => a.apply_id)),
    );
  };

  const toggleDetail = async (applicant: Applicant) => {
    if (expandedId === applicant.apply_id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(applicant.apply_id);
    if (!(applicant.apply_id in detailCache)) {
      try {
        const reason = await getApplicationDetail(studyId, applicant.apply_id);
        setDetailCache((prev) => ({ ...prev, [applicant.apply_id]: reason }));
      } catch {
        setDetailCache((prev) => ({
          ...prev,
          [applicant.apply_id]: "지원 동기를 불러오지 못했습니다.",
        }));
      }
    }
  };

  const handleBulkAction = async (action: "accept" | "reject") => {
    if (selectedIds.size === 0 || isSubmitting) {
      return;
    }
    const label = action === "accept" ? "합격" : "불합격";
    if (!confirm(`선택한 ${selectedIds.size}명을 ${label} 처리할까요?`)) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const applyIds = Array.from(selectedIds);
      if (action === "accept") {
        await acceptApplications(studyId, applyIds);
      } else {
        await rejectApplications(studyId, applyIds);
      }
      setSelectedIds(new Set());
      await fetchApplicants();
    } catch {
      setErrorMessage(`${label} 처리에 실패했습니다. 다시 시도해주세요.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applicants = applicantsPage.content;
  const allSelected =
    applicants.length > 0 && selectedIds.size === applicants.length;

  return (
    <div>
      {/* Count, filters & bulk actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-text-basic text-body-l font-bold leading-normal">
          신청자{" "}
          <span className="text-text-primary">
            {applicantsPage.total_elements}
          </span>
          명
        </p>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <div className="flex shrink-0 items-center gap-3">
            <p className="text-body-m whitespace-nowrap font-bold">신청상태</p>
            <Select
              id="manage-status-filter"
              variant="text"
              size="sm"
              noPadding
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v as ApplyStatusFilter | "ALL");
                resetListState();
              }}
              placeholder="상태"
              dropdownAlign="right"
              options={[
                { value: "ALL", label: "전체" },
                { value: "PENDING", label: "대기중" },
                { value: "ACCEPT", label: "합격" },
                { value: "REJECT", label: "불합격" },
              ]}
            />
          </div>
          <div className="bg-divider-gray h-4 w-px" aria-hidden="true" />
          <div className="flex shrink-0 items-center gap-3">
            <p className="text-body-m whitespace-nowrap font-bold">정렬기준</p>
            <Select
              id="manage-sort"
              variant="text"
              size="sm"
              noPadding
              value={sortOrder}
              onChange={(v) => {
                setSortOrder(v as "DESC" | "ASC");
                resetListState();
              }}
              placeholder="정렬기준"
              dropdownAlign="right"
              options={[
                { value: "DESC", label: "최신순" },
                { value: "ASC", label: "오래된순" },
              ]}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-text-danger text-body-s mb-4">{errorMessage}</p>
      )}

      {/* Applicant table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <p className="text-lg">불러오는 중...</p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">신청자가 없습니다</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  aria-label="전체 선택"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>이름</TableHead>
              <TableHead>순위</TableHead>
              <TableHead>지원 동기</TableHead>
              <TableHead>신청일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => (
              <Fragment key={applicant.apply_id}>
                <TableRow
                  interactive
                  tabIndex={0}
                  aria-expanded={expandedId === applicant.apply_id}
                  onClick={() => toggleDetail(applicant)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleDetail(applicant);
                    }
                  }}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`${applicant.applier_name} 선택`}
                      checked={selectedIds.has(applicant.apply_id)}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      onChange={() => toggleSelect(applicant.apply_id)}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-bold">
                    {applicant.applier_name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {applicant.priority}순위
                  </TableCell>
                  <TableCell className="max-w-[360px]">
                    <span className="line-clamp-1 max-w-full text-left">
                      {applicant.study_comment || "(내용 없음)"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatApplyDate(applicant.apply_date)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      label={applicant.study_status}
                      variant={
                        statusBadgeVariant[applicant.study_status] ?? "disabled"
                      }
                      appearance="solid-pastel"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
                {expandedId === applicant.apply_id && (
                  <TableRow className="bg-surface-gray-subtler">
                    <TableCell colSpan={6} className="py-4">
                      <p className="text-text-basic text-body-m">
                        {detailCache[applicant.apply_id] ?? "불러오는 중..."}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && applicants.length > 0 && (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="tertiary"
            size="medium"
            disabled={selectedIds.size === 0 || isSubmitting}
            onClick={() => handleBulkAction("reject")}
          >
            선택 불합격
          </Button>
          <Button
            variant="primary"
            size="medium"
            disabled={selectedIds.size === 0 || isSubmitting}
            onClick={() => handleBulkAction("accept")}
          >
            선택 합격
          </Button>
        </div>
      )}

      {/* Pagination */}
      {applicantsPage.total_pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            totalPages={applicantsPage.total_pages}
            currentPage={page + 1}
            onPageChange={(nextPage) => {
              setPage(nextPage - 1);
              setSelectedIds(new Set());
              setExpandedId(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
