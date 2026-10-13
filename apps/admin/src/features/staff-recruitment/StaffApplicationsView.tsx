"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HTTPError } from "ky";
import { ShieldAlert } from "lucide-react";
import type {
  AdminStaffRecruitmentRound,
  StaffApplicationDetail,
  StaffApplicationSummary,
} from "@core/types/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { PageHeader } from "@/components/page-header";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { toast } from "sonner";
import {
  getStaffApplicationDetail,
  getStaffApplications,
  getStaffRecruitments,
  type StaffApplicationPage,
} from "./api";

const EMPTY_PAGE: StaffApplicationPage = {
  content: [],
  totalElements: 0,
  currentPage: 0,
  totalPages: 0,
  pageSize: 20,
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function choicesLabel(item: StaffApplicationSummary) {
  return [...item.applied_departments]
    .sort((a, b) => a.priority - b.priority)
    .map((choice) => `${choice.priority}지망 ${choice.name}`)
    .join(" · ");
}

export function StaffApplicationsView({
  initialRecruitmentId,
}: {
  initialRecruitmentId?: number;
}) {
  const [rounds, setRounds] = useState<AdminStaffRecruitmentRound[]>([]);
  const [recruitmentId, setRecruitmentId] = useState<number | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<StaffApplicationPage>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<StaffApplicationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const selectedRound = useMemo(
    () =>
      rounds.find((round) => round.recruitment_id === recruitmentId) ?? null,
    [recruitmentId, rounds],
  );

  useEffect(() => {
    if (initialRecruitmentId) setRecruitmentId(initialRecruitmentId);
    getStaffRecruitments()
      .then((items) => {
        setRounds(items);
        if (!initialRecruitmentId) {
          setRecruitmentId(items[0]?.recruitment_id ?? null);
        }
      })
      .catch(async (error) => {
        if (!initialRecruitmentId) {
          toast.error(await handleApiError(error));
        }
      })
      .finally(() => setLoading(false));
  }, [initialRecruitmentId]);

  const load = useCallback(async () => {
    if (!recruitmentId) return;
    setLoading(true);
    try {
      setData(
        await getStaffApplications({
          recruitmentId,
          departmentId: departmentId ?? undefined,
          search: search || undefined,
          page,
        }),
      );
      setAccessDenied(false);
    } catch (error) {
      setData(EMPTY_PAGE);
      setDetail(null);
      if (error instanceof HTTPError && error.response.status === 403) {
        setAccessDenied(true);
      }
      toast.error(await handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [departmentId, page, recruitmentId, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const openDetail = async (applicationId: number) => {
    if (!recruitmentId || detailLoading) return;
    setDetailLoading(true);
    try {
      setDetail(await getStaffApplicationDetail(recruitmentId, applicationId));
    } catch (error) {
      setDetail(null);
      if (error instanceof HTTPError && error.response.status === 403) {
        setData(EMPTY_PAGE);
        setAccessDenied(true);
      }
      toast.error(await handleApiError(error));
    } finally {
      setDetailLoading(false);
    }
  };

  if (accessDenied) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <ShieldAlert className="text-muted-foreground h-12 w-12" />
        <h1 className="text-xl font-bold">지원서 열람 권한이 없습니다</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          회장단 또는 이 모집 회차의 유효한 열람자만 지원서를 확인할 수
          있습니다. 회수되거나 만료된 권한은 다음 요청부터 적용됩니다.
        </p>
        <Button variant="outline" onClick={() => void load()}>
          권한 다시 확인
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <PageHeader
        title="운영진 지원서"
        description="회차와 지망 부서를 기준으로 제출된 지원서를 확인합니다."
      />

      <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_minmax(180px,1fr)_minmax(220px,2fr)_auto]">
        <Select
          value={recruitmentId ? String(recruitmentId) : undefined}
          onValueChange={(value) => {
            setRecruitmentId(Number(value));
            setDepartmentId(null);
            setPage(0);
          }}
        >
          <SelectTrigger aria-label="모집 회차">
            <SelectValue placeholder="모집 회차 선택" />
          </SelectTrigger>
          <SelectContent>
            {recruitmentId && !selectedRound && (
              <SelectItem value={String(recruitmentId)}>
                회차 #{recruitmentId}
              </SelectItem>
            )}
            {rounds.map((round) => (
              <SelectItem
                key={round.recruitment_id}
                value={String(round.recruitment_id)}
              >
                {round.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={departmentId ? String(departmentId) : "all"}
          onValueChange={(value) => {
            setDepartmentId(value === "all" ? null : Number(value));
            setPage(0);
          }}
          disabled={!selectedRound}
        >
          <SelectTrigger aria-label="지원 부서">
            <SelectValue placeholder="지원 부서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 부서</SelectItem>
            {selectedRound?.departments.map((department) => (
              <SelectItem
                key={department.department_id}
                value={String(department.department_id)}
              >
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setSearch(searchInput.trim());
              setPage(0);
            }
          }}
          placeholder="제출 당시 이름 검색"
          aria-label="지원자 이름 검색"
        />
        <Button
          onClick={() => {
            setSearch(searchInput.trim());
            setPage(0);
          }}
        >
          검색
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>학과</TableHead>
              <TableHead>지원 부서</TableHead>
              <TableHead>제출 시각</TableHead>
              <TableHead>상세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && data.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-28">
                  조건에 맞는 지원서가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data.content.map((item) => (
                <TableRow key={item.application_id}>
                  <TableCell className="font-medium">
                    {item.applicant_name}
                  </TableCell>
                  <TableCell>{item.applicant_department ?? "-"}</TableCell>
                  <TableCell>{choicesLabel(item)}</TableCell>
                  <TableCell>{dateLabel(item.submitted_at)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={detailLoading}
                      onClick={() => void openDetail(item.application_id)}
                    >
                      보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OffsetPagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        totalElements={data.totalElements}
        pageSize={data.pageSize}
        onPageChange={setPage}
      />

      <Dialog
        open={detail !== null}
        onOpenChange={(open) => !open && setDetail(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>{detail.applicant_name} 지원서</DialogTitle>
                <DialogDescription>
                  {dateLabel(detail.submitted_at)} 제출 · {choicesLabel(detail)}
                </DialogDescription>
              </DialogHeader>
              <dl className="grid gap-3 rounded-md border p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">학과</dt>
                  <dd>{detail.applicant_department ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">학번</dt>
                  <dd>{detail.applicant_user_id ?? "탈퇴 회원"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">이메일</dt>
                  <dd className="break-all">{detail.applicant_email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">연락처</dt>
                  <dd>{detail.applicant_phone_num ?? "-"}</dd>
                </div>
              </dl>
              <ol className="space-y-4">
                {detail.answers.map((answer, index) => (
                  <li
                    key={answer.question_id}
                    className="rounded-md border p-4"
                  >
                    <h3 className="font-semibold">
                      {index + 1}. {answer.question_label}
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                      {answer.answer || "답변 없음"}
                    </p>
                  </li>
                ))}
              </ol>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
