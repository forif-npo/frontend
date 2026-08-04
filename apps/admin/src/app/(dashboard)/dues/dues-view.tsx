"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { updateDues } from "./api";
import type { DuesMember, DuesPageData, DuesSort } from "./types";

interface DuesViewProps {
  initialData: DuesPageData;
  initialSearch: string;
}

const sortOptions: { value: DuesSort; label: string }[] = [
  { value: "NEEDS_ATTENTION", label: "확인 필요 우선" },
  { value: "GOOGLE_FORM_SUBMITTED", label: "구글폼 미제출 우선" },
  { value: "DUES_PAID", label: "회비 미납 우선" },
  { value: "NAME", label: "이름순" },
];

function statusText(member: DuesMember) {
  if (member.duesPaid && member.googleFormSubmitted) {
    return "확인 완료";
  }
  if (!member.duesPaid && !member.googleFormSubmitted) {
    return "미납 · 미제출";
  }
  if (!member.googleFormSubmitted) {
    return "미제출";
  }
  return "미납";
}

export function DuesView({ initialData, initialSearch }: DuesViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [pendingUpdates, setPendingUpdates] = useState<Map<number, DuesMember>>(
    new Map(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<Record<
    string,
    string | null
  > | null>(null);
  const currentSort =
    (searchParams.get("sort") as DuesSort | null) ?? "NEEDS_ATTENTION";

  useEffect(() => {
    setSearch(initialSearch);
    setPendingUpdates(new Map());
  }, [initialData.content, initialSearch]);

  const navigate = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const requestNavigation = (next: Record<string, string | null>) => {
    if (pendingUpdates.size > 0) {
      setPendingNavigation(next);
      return;
    }
    navigate(next);
  };

  const discardChangesAndNavigate = () => {
    if (!pendingNavigation) return;
    setPendingUpdates(new Map());
    navigate(pendingNavigation);
    setPendingNavigation(null);
  };

  const handleStatusChange = (
    member: DuesMember,
    field: "duesPaid" | "googleFormSubmitted",
    checked: boolean,
  ) => {
    setError(null);
    setPendingUpdates((current) => {
      const next = new Map(current);
      const existing = next.get(member.userId) ?? member;
      const updatedMember = { ...existing, [field]: checked };
      const original = initialData.content.find(
        (item) => item.userId === member.userId,
      );

      if (
        original &&
        original.duesPaid === updatedMember.duesPaid &&
        original.googleFormSubmitted === updatedMember.googleFormSubmitted
      ) {
        next.delete(member.userId);
      } else {
        next.set(member.userId, updatedMember);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (pendingUpdates.size === 0) return;

    setIsSaving(true);
    setError(null);
    try {
      await updateDues(
        Array.from(pendingUpdates.values()).map((member) => ({
          userId: member.userId,
          duesPaid: member.duesPaid,
          googleFormSubmitted: member.googleFormSubmitted,
        })),
      );
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "상태를 저장하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formNotSubmittedCount =
    initialData.summary.totalCount -
    initialData.summary.googleFormSubmittedCount;
  const duesNotPaidCount =
    initialData.summary.totalCount - initialData.summary.duesPaidCount;

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="회비 관리"
        description={`${initialData.semester.label} 부원의 회비 납부와 구글폼 제출 여부를 관리합니다.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="전체 부원" value={initialData.summary.totalCount} />
        <SummaryCard
          label="구글폼 미제출"
          value={formNotSubmittedCount}
          tone="orange"
        />
        <SummaryCard label="회비 미납" value={duesNotPaidCount} tone="red" />
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
        <div className="flex items-center gap-2">
          <Select
            value={currentSort}
            onValueChange={(sort) => requestNavigation({ sort, page: "0" })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => void handleSave()}
            disabled={pendingUpdates.size === 0 || isSaving}
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>

      {pendingUpdates.size > 0 && (
        <p className="text-muted-foreground text-sm">
          변경한 {pendingUpdates.size}건은 저장 버튼을 눌러야 반영됩니다.
        </p>
      )}

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>학번</TableHead>
              <TableHead>학과</TableHead>
              <TableHead>스터디</TableHead>
              <TableHead className="text-center">구글폼 제출</TableHead>
              <TableHead className="text-center">회비 납부</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.content.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-32 text-center"
                >
                  조건에 맞는 현재 학기 부원이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              initialData.content.map((member) => {
                const pendingMember = pendingUpdates.get(member.userId);
                return (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">
                      {member.userName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {member.userId}
                    </TableCell>
                    <TableCell>{member.department || "-"}</TableCell>
                    <TableCell>{member.currentStudyName || "-"}</TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        aria-label={`${member.userName} 구글폼 제출`}
                        checked={
                          pendingMember?.googleFormSubmitted ??
                          member.googleFormSubmitted
                        }
                        disabled={isSaving}
                        onChange={(event) =>
                          handleStatusChange(
                            member,
                            "googleFormSubmitted",
                            event.target.checked,
                          )
                        }
                        className="accent-primary size-4 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        aria-label={`${member.userName} 회비 납부`}
                        checked={pendingMember?.duesPaid ?? member.duesPaid}
                        disabled={isSaving}
                        onChange={(event) =>
                          handleStatusChange(
                            member,
                            "duesPaid",
                            event.target.checked,
                          )
                        }
                        className="accent-primary size-4 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </TableCell>
                    <TableCell>{statusText(member)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <OffsetPagination
        currentPage={initialData.currentPage}
        totalPages={initialData.totalPages}
        totalElements={initialData.totalElements}
        pageSize={initialData.pageSize}
        onPageChange={(page) => requestNavigation({ page: page.toString() })}
      />

      <Dialog
        open={pendingNavigation !== null}
        onOpenChange={(open) => {
          if (!open) setPendingNavigation(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>저장하지 않은 변경사항이 있습니다</DialogTitle>
            <DialogDescription>
              이동하면 체크한 내용이 저장되지 않습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingNavigation(null)}
            >
              계속 수정
            </Button>
            <Button onClick={discardChangesAndNavigate}>
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
  const toneClassName = {
    default: "text-foreground",
    orange: "text-orange-600",
    red: "text-red-600",
    green: "text-green-600",
  }[tone];

  return (
    <div className="rounded-md border p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${toneClassName}`}>
        {value}명
      </p>
    </div>
  );
}
