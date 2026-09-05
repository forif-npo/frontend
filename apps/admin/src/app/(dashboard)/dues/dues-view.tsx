"use client";

import { DataTable } from "@/components/list/data-table";
import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { appendSortingParams } from "@/lib/list-sorting";
import { updateDues } from "./api";
import { duesColumns } from "./dues-columns";
import type { DuesMember, DuesPageData } from "./types";

export function DuesView({
  initialData,
  initialSearch,
  initialSorting,
}: {
  initialData: DuesPageData;
  initialSearch: string;
  initialSorting: SortingState;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedMembersById, setSelectedMembersById] = useState<
    Map<number, DuesMember>
  >(new Map());
  const [pendingUpdates, setPendingUpdates] = useState<Map<number, DuesMember>>(
    new Map(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<Record<
    string,
    string | null
  > | null>(null);
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
  }, [initialSearch, initialSortingKey]);

  const displayMembers = useMemo(
    () =>
      initialData.content.map(
        (member) => pendingUpdates.get(member.userId) ?? member,
      ),
    [initialData.content, pendingUpdates],
  );
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
  const navigate = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    router.push(`${pathname}?${params}`);
  };
  const requestNavigation = (next: Record<string, string | null>) => {
    if (pendingUpdates.size > 0) {
      setPendingNavigation(next);
      return;
    }
    navigate(next);
  };
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (pendingUpdates.size > 0) {
      setError(
        "저장하지 않은 일괄 처리 내용이 있습니다. 저장하거나 이동을 취소한 뒤 정렬해주세요.",
      );
      return;
    }
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    setSorting(nextSorting);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort");
    params.set("page", "0");
    appendSortingParams(params, nextSorting);
    window.location.assign(`${pathname}?${params}`);
  };
  const updateMembers = (
    members: DuesMember[],
    field: "duesPaid" | "googleFormSubmitted",
    value: boolean,
  ) => {
    if (members.length === 0) return;
    setError(null);
    setPendingUpdates((current) => {
      const next = new Map(current);
      members.forEach((member) => {
        const original =
          selectedMembersById.get(member.userId) ??
          initialData.content.find((item) => item.userId === member.userId) ??
          member;
        const updated = {
          ...(next.get(member.userId) ?? original),
          [field]: value,
        };
        if (
          updated.duesPaid === original.duesPaid &&
          updated.googleFormSubmitted === original.googleFormSubmitted
        )
          next.delete(member.userId);
        else next.set(member.userId, updated);
      });
      return next;
    });
  };
  const updateSelected = (
    field: "duesPaid" | "googleFormSubmitted",
    value: boolean,
  ) => updateMembers(selectedMembers, field, value);
  const save = async () => {
    if (pendingUpdates.size === 0 || isSaving) return;
    try {
      setIsSaving(true);
      setError(null);
      await updateDues(
        Array.from(pendingUpdates.values()).map((member) => ({
          userId: member.userId,
          duesPaid: member.duesPaid,
          googleFormSubmitted: member.googleFormSubmitted,
        })),
      );
      setPendingUpdates(new Map());
      clearSelection();
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
  const formNotSubmitted =
    initialData.summary.totalCount -
    initialData.summary.googleFormSubmittedCount;
  const duesNotPaid =
    initialData.summary.totalCount - initialData.summary.duesPaidCount;

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="회비 관리"
        description={`${initialData.semester.label} 합격 부원의 회비 납부와 구글폼 제출 여부를 일괄 관리합니다.`}
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
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={() =>
            requestNavigation({ search: search || null, page: "0" })
          }
          placeholder="이름 또는 학과 검색"
        />
        <Button
          disabled={pendingUpdates.size === 0 || isSaving}
          onClick={() => void save()}
        >
          {isSaving
            ? "저장 중..."
            : `저장${pendingUpdates.size ? ` (${pendingUpdates.size})` : ""}`}
        </Button>
      </div>
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
          onClick={() => updateSelected("googleFormSubmitted", true)}
        >
          구글폼 제출 처리
        </Button>
        <Button
          size="sm"
          disabled={!selectedMembers.length || isSaving}
          onClick={() => updateSelected("duesPaid", true)}
        >
          회비 납부 처리
        </Button>
      </div>
      {pendingUpdates.size > 0 && (
        <p className="text-muted-foreground text-sm">
          변경한 {pendingUpdates.size}건은 저장 버튼을 눌러야 반영됩니다.
        </p>
      )}
      {error && (
        <p className="border-border-danger-light bg-danger-5 text-text-danger rounded-md border px-4 py-3 text-sm">
          {error}
        </p>
      )}
      <DataTable
        columns={duesColumns}
        data={displayMembers}
        showPagination={false}
        enableRowSelection
        getRowId={(member) => String(member.userId)}
        renderRowActions={(member) => (
          <>
            <DropdownMenuItem
              disabled={isSaving}
              onClick={() =>
                updateMembers(
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
            <DropdownMenuItem
              disabled={isSaving}
              onClick={() =>
                updateMembers([member], "duesPaid", !member.duesPaid)
              }
            >
              {member.duesPaid ? "회비 납부 처리 취소" : "회비 납부 처리"}
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
      <Dialog
        open={pendingNavigation !== null}
        onOpenChange={(open) => !open && setPendingNavigation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>저장하지 않은 변경사항이 있습니다</DialogTitle>
            <DialogDescription>
              이동하면 일괄 처리한 내용이 저장되지 않습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingNavigation(null)}
            >
              계속 수정
            </Button>
            <Button
              onClick={() => {
                const next = pendingNavigation;
                setPendingUpdates(new Map());
                setPendingNavigation(null);
                if (next) navigate(next);
              }}
            >
              저장하지 않고 이동
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
