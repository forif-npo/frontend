"use client";

import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
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

function statusBadge(member: DuesMember) {
  if (member.duesPaid && member.googleFormSubmitted) {
    return <Badge className="bg-green-600 hover:bg-green-600">확인 완료</Badge>;
  }
  if (!member.duesPaid && !member.googleFormSubmitted) {
    return <Badge variant="destructive">미납 · 미제출</Badge>;
  }
  if (!member.googleFormSubmitted) {
    return (
      <Badge
        variant="outline"
        className="border-orange-300 bg-orange-50 text-orange-700"
      >
        미제출
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700">
      미납
    </Badge>
  );
}

export function DuesView({ initialData, initialSearch }: DuesViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [members, setMembers] = useState(initialData.content);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentSort =
    (searchParams.get("sort") as DuesSort | null) ?? "NEEDS_ATTENTION";

  useEffect(() => {
    setMembers(initialData.content);
    setSearch(initialSearch);
  }, [initialData.content, initialSearch]);

  const navigate = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = async (
    member: DuesMember,
    field: "duesPaid" | "googleFormSubmitted",
    checked: boolean,
  ) => {
    setUpdatingUserId(member.userId);
    setError(null);

    try {
      const updated = await updateDues(member.userId, { [field]: checked });
      setMembers((current) =>
        current.map((item) => (item.userId === member.userId ? updated : item)),
      );
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "상태를 저장하지 못했습니다.",
      );
    } finally {
      setUpdatingUserId(null);
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
          onSearch={() => navigate({ search: search || null, page: "0" })}
          placeholder="이름 또는 학과 검색"
        />
        <Select
          value={currentSort}
          onValueChange={(sort) => navigate({ sort, page: "0" })}
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
      </div>

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
              <TableHead>학과</TableHead>
              <TableHead>스터디</TableHead>
              <TableHead className="text-center">구글폼 제출</TableHead>
              <TableHead className="text-center">회비 납부</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground h-32 text-center"
                >
                  조건에 맞는 현재 학기 부원이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => {
                const isUpdating = updatingUserId === member.userId;
                return (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">
                      {member.userName}
                    </TableCell>
                    <TableCell>{member.department || "-"}</TableCell>
                    <TableCell>{member.currentStudyName || "-"}</TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        aria-label={`${member.userName} 구글폼 제출`}
                        checked={member.googleFormSubmitted}
                        disabled={isUpdating}
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
                        checked={member.duesPaid}
                        disabled={isUpdating}
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
                    <TableCell>{statusBadge(member)}</TableCell>
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
        onPageChange={(page) => navigate({ page: page.toString() })}
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
