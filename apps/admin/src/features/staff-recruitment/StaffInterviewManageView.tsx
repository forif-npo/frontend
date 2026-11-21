"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
import type { AdminStaffRecruitmentRound } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getStaffRecruitments } from "./api";
import { StaffInterviewBoardSection } from "./StaffInterviewBoardSection";
import { StaffInterviewQuestionsSection } from "./StaffInterviewQuestionsSection";

/**
 * 면접 관리. 위에서 공통·부서별 면접 질문을 정하고,
 * 아래 보드에서 면접자를 면접 전 → 면접 완료 → 합격·불합격으로 옮긴다.
 */
export function StaffInterviewManageView({ recruitmentId }: { recruitmentId: number }) {
  const [round, setRound] = useState<AdminStaffRecruitmentRound | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [questionsVersion, setQuestionsVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rounds = await getStaffRecruitments();
        if (cancelled) return;
        const found = rounds.find((item) => item.recruitment_id === recruitmentId) ?? null;
        if (!found) setLoadError("모집 회차를 찾을 수 없습니다.");
        setRound(found);
      } catch (error) {
        if (!cancelled) setLoadError(await handleApiError(error));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recruitmentId]);

  if (loadError) {
    return <div className="text-muted-foreground p-8 text-center">{loadError}</div>;
  }
  if (!round) {
    return <div className="text-muted-foreground p-8 text-center">면접 관리를 불러오는 중입니다.</div>;
  }

  return (
    <div className="space-y-10 p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="면접 관리"
          description={`“${formatStaffRecruitmentTitle(round.act_year, round.act_semester)}” 회차의 면접 질문과 면접자를 관리합니다.`}
          leadingAction={
            <Button variant="ghost" size="icon" className="size-11" asChild>
              <Link href="/staff-recruitments" aria-label="모집 관리로 돌아가기" title="모집 관리로 돌아가기">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
          }
        />
        <Button variant="outline" asChild>
          <Link href={`/staff-recruitments/${recruitmentId}/interview`}>
            <CalendarClock className="mr-1 size-4" />
            면접 일정
          </Link>
        </Button>
      </div>

      <StaffInterviewQuestionsSection
        recruitmentId={recruitmentId}
        departments={round.departments
          .filter((department) => department.active)
          .map((department) => ({ department_id: department.department_id, name: department.name }))}
        onChanged={() => setQuestionsVersion((version) => version + 1)}
      />

      <StaffInterviewBoardSection recruitmentId={recruitmentId} questionsVersion={questionsVersion} />
    </div>
  );
}
