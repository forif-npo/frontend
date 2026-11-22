"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HTTPError } from "ky";
import { MoreVertical, ShieldAlert } from "lucide-react";
import type { AdminStaffRecruitmentRound, StaffApplicationDetail, StaffApplicationSummary } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment, formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { PageHeader } from "@/components/page-header";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/list/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/Toast";
import { StaffApplicationAnswerList } from "./StaffApplicationAnswerList";
import { StaffApplicationDecision } from "./StaffApplicationDecision";
import { getStaffApplicationDetail, getStaffApplications, getReviewableStaffRecruitments, type StaffApplicationPage } from "./api";

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

function departmentName(item: StaffApplicationSummary, priority: 1 | 2) {
  const name = item.applied_departments.find(
    (choice) => choice.priority === priority,
  )?.name;
  return name ? formatStaffRecruitmentDepartment(name) : "-";
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
    getReviewableStaffRecruitments()
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
                {formatStaffRecruitmentTitle(
                  round.act_year,
                  round.act_semester,
                )}
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
                {formatStaffRecruitmentDepartment(department.name)}
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
              <TableHead>1지망 부서</TableHead>
              <TableHead>2지망 부서</TableHead>
              <TableHead>제출 시각</TableHead>
              <TableHead className="w-14">
                <span className="sr-only">작업</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && data.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground h-28">
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
                  <TableCell>{departmentName(item, 1)}</TableCell>
                  <TableCell>{departmentName(item, 2)}</TableCell>
                  <TableCell>{dateLabel(item.submitted_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-8 w-8"
                          disabled={detailLoading}
                          aria-label={`${item.applicant_name} 작업 메뉴`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onSelect={() => void openDetail(item.application_id)}
                        >
                          지원서 보기
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-6 sm:p-8">
          {detail && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{detail.applicant_name} 지원서</DialogTitle>
                <DialogDescription>지원자 정보와 문항별 답변</DialogDescription>
              </DialogHeader>
              <div className="space-y-8">
                <section
                  className="space-y-4"
                  aria-labelledby="applicant-info-heading"
                >
                  <h3
                    id="applicant-info-heading"
                    className="text-lg font-semibold"
                  >
                    지원자 정보
                  </h3>
                  <Table className="text-sm">
                    <TableBody>
                      {[
                        ["이름", detail.applicant_name],
                        ["학과", detail.applicant_department ?? "-"],
                        ["학번", detail.applicant_user_id ?? "탈퇴 회원"],
                        ["이메일", detail.applicant_email],
                        ["연락처", detail.applicant_phone_num ?? "-"],
                        ["1지망 부서", departmentName(detail, 1)],
                        ["2지망 부서", departmentName(detail, 2)],
                      ].map(([label, value]) => (
                        <TableRow key={label} className="hover:bg-transparent">
                          <th
                            scope="row"
                            className="text-muted-foreground w-28 whitespace-nowrap py-3 pr-4 text-left font-normal"
                          >
                            {label}
                          </th>
                          <TableCell className="break-all py-3 text-left">
                            {value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
                <section
                  className="space-y-4"
                  aria-labelledby="application-answers-heading"
                >
                  <h3
                    id="application-answers-heading"
                    className="text-lg font-semibold"
                  >
                    지원서
                  </h3>
                  <StaffApplicationAnswerList detail={detail} />
                </section>
              </div>
              <DialogFooter className="gap-3 sm:items-center">
                {selectedRound?.publication_status === "CLOSED" && (
                  <StaffApplicationDecision
                    recruitmentId={detail.recruitment_id}
                    applicationId={detail.application_id}
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDetail(null)}
                >
                  닫기
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
