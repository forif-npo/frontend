"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Select } from "@ui/components/client";
import { Button } from "@ui/components/client";
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

const PAGE_SIZE = 20;

const statusBadgeStyle: Record<string, string> = {
  대기중: "bg-[#f4f5f6] text-[#464c53]",
  승낙: "bg-[#ecf2fe] text-[#0b50d0]",
  거절: "bg-[#fdefec] text-[#d3302f]",
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
        <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
          신청자{" "}
          <span className="text-[#0b50d0]">
            {applicantsPage.total_elements}
          </span>
          명
        </p>
        <div className="flex items-center gap-2">
          <Select
            id="manage-status-filter"
            variant="text"
            size="sm"
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
          <Select
            id="manage-sort"
            variant="text"
            size="sm"
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
      </div>

      {errorMessage && (
        <p className="mb-4 text-[15px] text-[#d3302f]">{errorMessage}</p>
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
        <div className="overflow-hidden rounded-[8px] border border-[#cdd1d5]">
          <table className="w-full text-left text-[15px] leading-[1.5]">
            <thead className="border-b border-[#cdd1d5] bg-[#f4f5f6] text-[#464c53]">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="전체 선택"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">순위</th>
                <th className="px-4 py-3">지원 동기</th>
                <th className="px-4 py-3">신청일</th>
                <th className="px-4 py-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <Fragment key={applicant.apply_id}>
                  <tr className="border-b border-[#e6e8ea] last:border-b-0 hover:bg-[#f8f9fa]">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`${applicant.applier_name} 선택`}
                        checked={selectedIds.has(applicant.apply_id)}
                        onChange={() => toggleSelect(applicant.apply_id)}
                      />
                    </td>
                    <td className="text-text-basic whitespace-nowrap px-4 py-3 font-bold">
                      {applicant.applier_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {applicant.priority}순위
                    </td>
                    <td className="max-w-[360px] px-4 py-3">
                      <button
                        className="line-clamp-1 text-left underline-offset-2 hover:underline"
                        onClick={() => toggleDetail(applicant)}
                      >
                        {applicant.study_comment || "(내용 없음)"}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatApplyDate(applicant.apply_date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex h-[24px] items-center rounded-[4px] px-2 text-[13px] ${
                          statusBadgeStyle[applicant.study_status] ??
                          "bg-[#f4f5f6] text-[#464c53]"
                        }`}
                      >
                        {applicant.study_status}
                      </span>
                    </td>
                  </tr>
                  {expandedId === applicant.apply_id && (
                    <tr className="border-b border-[#e6e8ea] bg-[#f8f9fa] last:border-b-0">
                      <td colSpan={6} className="px-4 py-4">
                        <p className="mb-1 text-[13px] font-bold text-[#464c53]">
                          지원 동기 전문
                        </p>
                        <p className="text-text-basic whitespace-pre-wrap">
                          {detailCache[applicant.apply_id] ?? "불러오는 중..."}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {applicantsPage.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button
            variant="tertiary"
            size="medium"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            이전
          </Button>
          <span className="text-[15px] text-[#464c53]">
            {page + 1} / {applicantsPage.total_pages}
          </span>
          <Button
            variant="tertiary"
            size="medium"
            disabled={page + 1 >= applicantsPage.total_pages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
