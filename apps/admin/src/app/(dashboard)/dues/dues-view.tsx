"use client";

import { DataTable } from "@/components/list/data-table";
import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { appendSortingParams } from "@/lib/list-sorting";
import { updateDues } from "./api";
import { duesColumns } from "./dues-columns";
import type { DuesMember, DuesPageData, UpdateDuesPayload } from "./types";

export function DuesView({
  initialData,
  initialSearch,
  initialDuesPaidFilter,
  initialGoogleFormSubmittedFilter,
  initialSorting,
}: {
  initialData: DuesPageData;
  initialSearch: string;
  initialDuesPaidFilter?: boolean;
  initialGoogleFormSubmittedFilter?: boolean;
  initialSorting: SortingState;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState(initialSearch);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedMembersById, setSelectedMembersById] = useState<
    Map<number, DuesMember>
  >(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const initialSortingKey = useMemo(
    () => JSON.stringify(initialSorting),
    [initialSorting],
  );

  useEffect(() => {
    setSearch(initialSearch);
    setSorting(initialSorting);
  }, [initialSearch, initialSorting, initialSortingKey]);

  // 검색어나 정렬 기준이 바뀌면 숨겨진 대상까지 일괄 처리되는 일을 막는다.
  // 페이지 이동만으로는 이 상태를 초기화하지 않아 선택이 누적된다.
  useEffect(() => {
    setRowSelection({});
    setSelectedMembersById(new Map());
  }, [
    initialDuesPaidFilter,
    initialGoogleFormSubmittedFilter,
    initialSearch,
    initialSortingKey,
  ]);

  const selectedMembers = useMemo(
    () => Array.from(selectedMembersById.values()),
    [selectedMembersById],
  );
  const updateRowSelection: OnChangeFn<RowSelectionState> = (updater) => {
    setRowSelection((currentSelection) => {
      const nextSelection =
        typeof updater === "function" ? updater(currentSelection) : updater;

      setSelectedMembersById((currentMembers) => {
        const nextMembers = new Map(currentMembers);
        initialData.content.forEach((member) => {
          if (nextSelection[String(member.userId)]) {
            // 이미 선택한 대상은 최초 조회 상태를 보존해 변경 취소 여부를 판별한다.
            if (!nextMembers.has(member.userId)) {
              nextMembers.set(member.userId, member);
            }
          } else {
            nextMembers.delete(member.userId);
          }
        });
        return nextMembers;
      });

      return nextSelection;
    });
  };
  const clearSelection = () => {
    setRowSelection({});
    setSelectedMembersById(new Map());
  };
  const focusSearchInput = () => {
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
  };
  const navigate = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    router.push(`${pathname}?${params}`);
  };
  const requestNavigation = (next: Record<string, string | null>) => {
    if (isSaving) return;
    navigate(next);
  };
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (isSaving) return;
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    setSorting(nextSorting);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort");
    params.set("page", "0");
    appendSortingParams(params, nextSorting);
    window.location.assign(`${pathname}?${params}`);
  };
  const updateMembers = async (
    members: DuesMember[],
    field: "duesPaid" | "googleFormSubmitted",
    value: boolean,
    clearSelectionAfterSave = false,
  ) => {
    if (members.length === 0 || isSaving) return;
    try {
      setIsSaving(true);
      setError(null);
      const updates: UpdateDuesPayload[] = members.map((member) => ({
        userId: member.userId,
        [field]: value,
      }));
      await updateDues(updates);
      if (clearSelectionAfterSave) clearSelection();
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "상태를 저장하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };
  const updateSelected = (
    field: "duesPaid" | "googleFormSubmitted",
    value: boolean,
  ) => updateMembers(selectedMembers, field, value, true);
  const formNotSubmitted =
    initialData.summary.totalCount -
    initialData.summary.googleFormSubmittedCount;
  const duesNotPaid =
    initialData.summary.totalCount - initialData.summary.duesPaidCount;

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="회비 관리"
        description={`${initialData.semester.label} 계좌 입금 내역을 부원 정보와 대조해 회비 납부와 구글폼 제출 여부를 관리합니다.`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="전체 합격 부원"
          value={initialData.summary.totalCount}
        />
        <SummaryCard
          label="구글폼 미제출"
          value={formNotSubmitted}
          tone="orange"
        />
        <SummaryCard label="회비 미납" value={duesNotPaid} tone="red" />
        <SummaryCard
          label="확인 완료"
          value={initialData.summary.completedCount}
          tone="green"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={() =>
              requestNavigation({ search: search || null, page: "0" })
            }
            placeholder="입금자명 또는 부원 이름 검색"
            autoFocus
            selectOnFocus
            inputRef={searchInputRef}
          />
          <Button
            type="button"
            variant={initialDuesPaidFilter === false ? "default" : "outline"}
            disabled={isSaving}
            onClick={() =>
              requestNavigation({
                dues_paid: initialDuesPaidFilter === false ? null : "false",
                page: "0",
              })
            }
          >
            입금 미확인만 보기
          </Button>
          <Button
            type="button"
            variant={
              initialGoogleFormSubmittedFilter === false ? "default" : "outline"
            }
            disabled={isSaving}
            onClick={() =>
              requestNavigation({
                google_form_submitted:
                  initialGoogleFormSubmittedFilter === false ? null : "false",
                page: "0",
              })
            }
          >
            구글폼 미제출만 보기
          </Button>
          {isSaving && (
            <span className="text-muted-foreground text-sm" role="status">
              처리 중...
            </span>
          )}
        </div>
      </div>
      {initialSearch && (
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium">“{initialSearch}”</span>
          검색 결과 {initialData.totalElements}명입니다. 이름, 학번, 학과를
          확인한 뒤 입금 확인 처리하세요.
        </p>
      )}
      <div className="bg-muted/30 flex flex-wrap items-center gap-2 rounded-md border p-3">
        <span className="mr-2 text-sm">{selectedMembers.length}명 선택</span>
        {selectedMembers.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clearSelection}>
            선택 해제
          </Button>
        )}
        <Button
          size="sm"
          disabled={!selectedMembers.length || isSaving}
          onClick={() => void updateSelected("googleFormSubmitted", true)}
        >
          구글폼 제출 처리
        </Button>
        <Button
          size="sm"
          disabled={!selectedMembers.length || isSaving}
          onClick={() => void updateSelected("duesPaid", true)}
        >
          입금 확인 처리
        </Button>
      </div>
      {error && (
        <p className="border-border-danger-light bg-danger-5 text-text-danger rounded-md border px-4 py-3 text-sm">
          {error}
        </p>
      )}
      <DataTable
        columns={duesColumns}
        data={initialData.content}
        showPagination={false}
        enableRowSelection
        getRowId={(member) => String(member.userId)}
        renderRowActions={(member) => (
          <>
            <DropdownMenuItem
              disabled={isSaving}
              onClick={() => {
                void updateMembers([member], "duesPaid", !member.duesPaid);
                focusSearchInput();
              }}
            >
              {member.duesPaid ? "입금 확인 취소" : "입금 확인 처리"}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isSaving}
              onClick={() =>
                void updateMembers(
                  [member],
                  "googleFormSubmitted",
                  !member.googleFormSubmitted,
                )
              }
            >
              {member.googleFormSubmitted
                ? "구글폼 제출 처리 취소"
                : "구글폼 제출 처리"}
            </DropdownMenuItem>
          </>
        )}
        rowSelection={rowSelection}
        onRowSelectionChange={updateRowSelection}
        renderSelectionHeader={(table) => (
          <input
            type="checkbox"
            aria-label="현재 페이지 전체 선택 또는 전체 선택 해제"
            className="h-4 w-4 cursor-pointer"
            checked={table.getIsAllPageRowsSelected()}
            onChange={() => {
              if (table.getIsAllPageRowsSelected()) {
                clearSelection();
                return;
              }
              table.toggleAllPageRowsSelected(true);
            }}
          />
        )}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
      <OffsetPagination
        currentPage={initialData.currentPage}
        totalPages={initialData.totalPages}
        totalElements={initialData.totalElements}
        pageSize={initialData.pageSize}
        onPageChange={(page) => requestNavigation({ page: String(page) })}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "orange" | "red" | "green";
}) {
  const className = {
    default: "text-foreground",
    orange: "text-text-warning",
    red: "text-text-danger",
    green: "text-text-success",
  }[tone];
  return (
    <div className="rounded-md border p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${className}`}>{value}명</p>
    </div>
  );
}
