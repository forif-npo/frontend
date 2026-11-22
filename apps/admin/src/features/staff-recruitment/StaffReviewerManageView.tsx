"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HTTPError } from "ky";
import { ArrowLeft, MoreVertical, ShieldAlert, UserPlus, Users } from "lucide-react";
import type { AdminStaffRecruitmentRound, StaffRecruitmentReviewer, StaffReviewerCandidate } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { PageHeader } from "@/components/page-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/list/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStaffReviewerCandidates, getStaffRecruitments, getStaffReviewers, grantStaffReviewer, revokeStaffReviewer } from "./api";
import { filterReviewerCandidates, REVIEWER_STATUS_LABELS, toReviewerExpiry } from "./reviewer";
import { toast } from "@/components/ui/Toast";

function isForbidden(error: unknown) {
  return error instanceof HTTPError && error.response.status === 403;
}

function formatDate(value: string) {
  const date = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.replaceAll("-", ". ") : "-";
}

function ReviewerDetails({
  userId,
  department,
  affiliation,
  grantedAt,
  expiresAt,
}: {
  userId: number;
  department: string | null;
  affiliation: string;
  grantedAt?: string;
  expiresAt?: string;
}) {
  const details = [
    { label: "학번", value: String(userId) },
    { label: "학과", value: department ?? "학과 미등록" },
    { label: "소속", value: affiliation },
    ...(grantedAt ? [{ label: "부여일", value: formatDate(grantedAt) }] : []),
    ...(expiresAt ? [{ label: "만료일", value: formatDate(expiresAt) }] : []),
  ];

  return (
    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-2 text-sm sm:grid-cols-3">
      {details.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="mt-1 break-words font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StaffReviewerManageView({
  recruitmentId,
}: {
  recruitmentId: number;
}) {
  const [round, setRound] = useState<AdminStaffRecruitmentRound | null>(null);
  const [candidates, setCandidates] = useState<StaffReviewerCandidate[]>([]);
  const [reviewers, setReviewers] = useState<StaffRecruitmentReviewer[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<StaffReviewerCandidate | null>(null);
  const [reviewerToRevoke, setReviewerToRevoke] =
    useState<StaffRecruitmentReviewer | null>(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rounds, nextCandidates, nextReviewers] = await Promise.all([
        getStaffRecruitments(),
        getStaffReviewerCandidates(recruitmentId),
        getStaffReviewers(recruitmentId),
      ]);
      setRound(
        rounds.find((item) => item.recruitment_id === recruitmentId) ?? null,
      );
      setCandidates(nextCandidates);
      setReviewers(nextReviewers);
      setAccessDenied(false);
    } catch (error) {
      setCandidates([]);
      setReviewers([]);
      if (isForbidden(error)) setAccessDenied(true);
      toast.error(await handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [recruitmentId]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredCandidates = useMemo(
    () => filterReviewerCandidates(candidates, query),
    [candidates, query],
  );

  const openGrantDialog = (candidate: StaffReviewerCandidate) => {
    setSelectedCandidate(candidate);
    setExpiresAt(round?.ends_at?.slice(0, 10) ?? "");
    setExpiryError(null);
  };

  const grant = async () => {
    if (!selectedCandidate || submitting) return;
    const normalizedExpiry = toReviewerExpiry(expiresAt);
    if (!normalizedExpiry) {
      setExpiryError("현재 시각 이후의 만료일을 선택해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      await grantStaffReviewer(recruitmentId, {
        user_id: selectedCandidate.user_id,
        expires_at: normalizedExpiry,
      });
      toast.success("지원서 열람 권한을 부여했습니다.");
      setSelectedCandidate(null);
      await load();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const revoke = async () => {
    if (!reviewerToRevoke || submitting) return;
    setSubmitting(true);
    try {
      await revokeStaffReviewer(recruitmentId, reviewerToRevoke.user_id);
      toast.success("지원서 열람 권한을 회수했습니다.");
      setReviewerToRevoke(null);
      await load();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (accessDenied) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <ShieldAlert className="text-muted-foreground h-12 w-12" />
        <h1 className="text-xl font-bold">열람자 관리 권한이 없습니다</h1>
        <p className="text-muted-foreground text-sm">
          열람자 초대와 회수는 회장과 부회장만 사용할 수 있습니다.
        </p>
        <Button variant="outline" asChild>
          <Link href="/staff-recruitments">모집 관리로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8">
      <PageHeader
        title="지원서 열람자 관리"
        description={
          round
            ? `“${formatStaffRecruitmentTitle(round.act_year, round.act_semester)}” 회차의 지원서 열람 권한을 관리합니다.`
            : "이 회차의 지원서 열람 권한을 관리합니다."
        }
        leadingAction={
          <Button variant="ghost" size="icon" className="size-11" asChild>
            <Link
              href="/staff-recruitments"
              aria-label="모집 관리로 돌아가기"
              title="모집 관리로 돌아가기"
            >
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        }
      />

      <section className="space-y-4" aria-labelledby="active-reviewers-heading">
        <div>
          <h2 id="active-reviewers-heading" className="text-lg font-bold">
            부여 내역
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            지원서 열람 권한은 이 모집 회차에만 적용됩니다.
          </p>
        </div>
        {loading ? (
          <div className="text-muted-foreground rounded-lg border p-8 text-center">
            열람자 목록을 불러오는 중입니다.
          </div>
        ) : reviewers.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Users className="text-muted-foreground mx-auto h-9 w-9" />
            <p className="mt-3 font-medium">부여된 열람 권한이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {reviewers.map((reviewer) => (
              <article
                key={`${reviewer.user_id}-${reviewer.granted_at}`}
                className="rounded-lg border p-4"
              >
                <div className="flex min-h-9 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{reviewer.user_name}</h3>
                    {reviewer.status !== "ACTIVE" && (
                      <Badge variant="outline">
                        {REVIEWER_STATUS_LABELS[reviewer.status]}
                      </Badge>
                    )}
                  </div>
                  {reviewer.status === "ACTIVE" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          disabled={submitting}
                          aria-label={`${reviewer.user_name} 액션 열기`}
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => setReviewerToRevoke(reviewer)}
                        >
                          권한 회수
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <ReviewerDetails
                  userId={reviewer.user_id}
                  department={reviewer.department}
                  affiliation={reviewer.affiliation}
                  grantedAt={reviewer.granted_at}
                  expiresAt={reviewer.expires_at}
                />
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        className="space-y-4"
        aria-labelledby="reviewer-candidates-heading"
      >
        <div>
          <h2 id="reviewer-candidates-heading" className="text-lg font-bold">
            현재 학기 운영진
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            현재 활동 학기의 운영진이면서 ADMIN 계정이 있는 회원에게만 열람
            권한을 부여합니다.
          </p>
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름, 학번, 학과, 소속으로 검색"
          aria-label="열람 후보 검색"
        />
        {!loading && filteredCandidates.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm">
            조건에 맞는 운영진이 없습니다.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map((candidate) => {
              const active = candidate.reviewer_status === "ACTIVE";
              return (
                <article
                  key={candidate.user_id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex min-h-9 items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{candidate.user_name}</h3>
                      {candidate.reviewer_status && !active && (
                        <Badge variant="outline">
                          {REVIEWER_STATUS_LABELS[candidate.reviewer_status]}
                        </Badge>
                      )}
                    </div>
                    {!active && candidate.has_admin_account && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground"
                            disabled={submitting}
                            aria-label={`${candidate.user_name} 액션 열기`}
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => openGrantDialog(candidate)}
                          >
                            <UserPlus className="mr-2 size-4" />
                            열람 권한 부여
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <ReviewerDetails
                    userId={candidate.user_id}
                    department={candidate.department}
                    affiliation={candidate.affiliation}
                  />
                  {!candidate.has_admin_account && (
                    <p className="text-destructive mt-2 text-xs">
                      ADMIN 계정이 없어 권한을 부여할 수 없습니다.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Dialog
        open={reviewerToRevoke !== null}
        onOpenChange={(open) => {
          if (!open && !submitting) setReviewerToRevoke(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>열람 권한 회수</DialogTitle>
            <DialogDescription>
              {reviewerToRevoke?.user_name} 님의 지원서 열람 권한을 회수할까요?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={submitting}
              onClick={() => setReviewerToRevoke(null)}
            >
              취소
            </Button>
            <Button disabled={submitting} onClick={() => void revoke()}>
              {submitting ? "회수 중..." : "권한 회수"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedCandidate !== null}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>열람 권한 부여</DialogTitle>
            <DialogDescription>
              {selectedCandidate?.user_name} 님에게 이 회차의 지원서 열람 권한을
              부여합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reviewer-expires-at">만료일</Label>
            <Input
              id="reviewer-expires-at"
              type="date"
              value={expiresAt}
              aria-invalid={Boolean(expiryError)}
              aria-describedby="reviewer-expiry-hint"
              onChange={(event) => {
                setExpiresAt(event.target.value);
                setExpiryError(null);
              }}
            />
            {expiryError && (
              <p role="alert" className="text-destructive text-sm">
                {expiryError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={submitting}
              onClick={() => setSelectedCandidate(null)}
            >
              취소
            </Button>
            <Button disabled={submitting} onClick={() => void grant()}>
              {submitting ? "부여 중..." : "부여"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
