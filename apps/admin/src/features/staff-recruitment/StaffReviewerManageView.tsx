"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HTTPError } from "ky";
import { ArrowLeft, ShieldAlert, UserPlus, Users } from "lucide-react";
import type {
  AdminStaffRecruitmentRound,
  StaffRecruitmentReviewer,
  StaffReviewerCandidate,
} from "@core/types/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateTimeLabel, toInputDateTime } from "@/utils/datetime";
import {
  getStaffReviewerCandidates,
  getStaffRecruitments,
  getStaffReviewers,
  grantStaffReviewer,
  revokeStaffReviewer,
} from "./api";
import {
  filterReviewerCandidates,
  REVIEWER_STATUS_LABELS,
  toReviewerExpiry,
} from "./reviewer";
import { toast } from "sonner";

function isForbidden(error: unknown) {
  return error instanceof HTTPError && error.response.status === 403;
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
    setExpiresAt(toInputDateTime(round?.ends_at ?? undefined));
    setExpiryError(null);
  };

  const grant = async () => {
    if (!selectedCandidate || submitting) return;
    const normalizedExpiry = toReviewerExpiry(expiresAt);
    if (!normalizedExpiry) {
      setExpiryError("현재 시각 이후의 만료 시각을 입력해주세요.");
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

  const revoke = async (reviewer: StaffRecruitmentReviewer) => {
    if (submitting) return;
    if (
      !window.confirm(
        `“${reviewer.user_name}” 운영진의 이 회차 열람 권한을 회수할까요?`,
      )
    ) {
      return;
    }
    setSubmitting(true);
    try {
      await revokeStaffReviewer(recruitmentId, reviewer.user_id);
      toast.success("지원서 열람 권한을 회수했습니다.");
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
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/staff-recruitments">
            <ArrowLeft className="mr-1 h-4 w-4" />
            모집 관리
          </Link>
        </Button>
        <PageHeader
          title="지원서 열람자 관리"
          description={
            round
              ? `“${round.title}” 회차의 지원서 열람 권한을 관리합니다.`
              : "이 회차의 지원서 열람 권한을 관리합니다."
          }
        />
      </div>

      <section className="space-y-4" aria-labelledby="active-reviewers-heading">
        <div>
          <h2 id="active-reviewers-heading" className="text-lg font-bold">
            부여 내역
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            권한은 이 모집 회차에만 적용되며, 회수 또는 만료 뒤 다음 요청부터
            지원서를 열람할 수 없습니다.
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{reviewer.user_name}</h3>
                      <Badge
                        variant={
                          reviewer.status === "ACTIVE" ? "default" : "outline"
                        }
                      >
                        {REVIEWER_STATUS_LABELS[reviewer.status]}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {reviewer.affiliation} ·{" "}
                      {reviewer.department ?? "학과 미등록"}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      부여 {formatDateTimeLabel(reviewer.granted_at)} · 만료{" "}
                      {formatDateTimeLabel(reviewer.expires_at)}
                    </p>
                  </div>
                  {reviewer.status === "ACTIVE" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={submitting}
                      onClick={() => void revoke(reviewer)}
                    >
                      권한 회수
                    </Button>
                  )}
                </div>
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
            운영진 후보
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            이 회차 활동 학기의 운영진이면서 ADMIN 계정이 있는 회원에게만 즉시
            권한을 부여합니다.
          </p>
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름·학번·학과·소속 검색"
          aria-label="열람 후보 검색"
        />
        {!loading && filteredCandidates.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm">
            조건에 맞는 운영진 후보가 없습니다.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map((candidate) => {
              const active = candidate.reviewer_status === "ACTIVE";
              return (
                <article
                  key={candidate.user_id}
                  className="flex flex-col justify-between gap-4 rounded-lg border p-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{candidate.user_name}</h3>
                      {candidate.reviewer_status && (
                        <Badge variant={active ? "default" : "outline"}>
                          {REVIEWER_STATUS_LABELS[candidate.reviewer_status]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {candidate.user_id} ·{" "}
                      {candidate.department ?? "학과 미등록"}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {candidate.affiliation}
                    </p>
                    {!candidate.has_admin_account && (
                      <p className="text-destructive mt-2 text-xs">
                        ADMIN 계정이 없어 권한을 부여할 수 없습니다.
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    disabled={
                      submitting || !candidate.has_admin_account || active
                    }
                    onClick={() => openGrantDialog(candidate)}
                  >
                    <UserPlus className="mr-1 h-4 w-4" />
                    {active ? "열람 중" : "열람 권한 부여"}
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Dialog
        open={selectedCandidate !== null}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>열람 권한 부여</DialogTitle>
            <DialogDescription>
              {selectedCandidate?.user_name} 운영진에게 이 회차의 지원서 열람
              권한을 즉시 부여합니다. 전역 ADMIN 권한이나 다른 회차 권한은
              변경하지 않습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reviewer-expires-at">만료 시각</Label>
            <Input
              id="reviewer-expires-at"
              type="datetime-local"
              value={expiresAt}
              aria-invalid={Boolean(expiryError)}
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
              {submitting ? "부여 중..." : "즉시 부여"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
