"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { StaffInterviewBoard, StaffInterviewCard, StaffInterviewStatus } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toast";
import { changeStaffInterviewStatus, finalizeStaffInterviewResults, getStaffInterviewBoard, getStaffInterviewSheet, registerPassedApplicantsAsStaff } from "./api";
import { INTERVIEW_COLUMNS, formatInterviewSlot, groupInterviewCards, interviewStatusTitle, moveInterviewCard, passDepartmentOptions } from "./interview-board";
import { usePassDepartmentPicker } from "./PassDepartmentDialog";
import { StaffInterviewSheetPanel } from "./StaffInterviewSheetPanel";
import { registrationResultMessage, registrationRosterHref } from "./staff-registration";

const DRAG_TYPE = "application/x-forif-interview-card";

/**
 * 면접 보드. 카드를 끌어 다른 열에 놓으면 상태가 바뀌고,
 * 끌 수 없을 때를 위해 같은 일을 하는 버튼도 둔다.
 * 카드를 누르면 오른쪽에 면접 기록지가 열린다.
 */
export function StaffInterviewBoardSection({
  recruitmentId,
  questionsVersion,
  requiredQuestionIds,
}: {
  recruitmentId: number;
  /** 면접 질문이 바뀔 때마다 늘어난다. 열려 있는 기록지를 다시 읽는 데 쓴다. */
  questionsVersion: number;
  requiredQuestionIds: ReadonlySet<number>;
}) {
  const [board, setBoard] = useState<StaffInterviewBoard | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<StaffInterviewStatus | null>(null);
  const [registering, setRegistering] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const passPicker = usePassDepartmentPicker();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      setBoard(await getStaffInterviewBoard(recruitmentId));
    } catch (error) {
      toast.error(await handleApiError(error));
    }
  }, [recruitmentId]);

  useEffect(() => {
    void load();
  }, [load]);

  const groups = useMemo(() => groupInterviewCards(board?.cards ?? []), [board]);

  /**
   * 화면을 먼저 옮기고, 실패하면 서버 상태로 되돌린다.
   * 합격은 지망 중 배정할 부서를 먼저 고른다. 고르다 취소하면 옮기지 않는다.
   */
  const changeStatus = async (applicationId: number, status: StaffInterviewStatus) => {
    const current = board?.cards.find((card) => card.application_id === applicationId);
    if (!board || board.results_finalized || !current || current.status === status) return null;

    let departmentId: number | null = null;
    if (status === "PASSED") {
      try {
        const sheet = await getStaffInterviewSheet(recruitmentId, applicationId);
        const picked = await passPicker.pick(sheet.applicant_name, passDepartmentOptions(sheet));
        if (picked === undefined) return null;
        departmentId = picked;
      } catch (error) {
        toast.error(await handleApiError(error));
        return null;
      }
    }

    setBoard((prev) => (prev ? { ...prev, cards: moveInterviewCard(prev.cards, applicationId, status) } : prev));
    try {
      const sheet = await changeStaffInterviewStatus(recruitmentId, applicationId, status, departmentId);
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              cards: prev.cards.map((card) =>
                card.application_id === applicationId
                  ? { ...card, status: sheet.status, passed_department: sheet.passed_department }
                  : card,
              ),
            }
          : prev,
      );
      toast.success(
        sheet.passed_department
          ? `${sheet.applicant_name}님을 ${formatStaffRecruitmentDepartment(sheet.passed_department.department_name)} 합격으로 옮겼습니다.`
          : `${sheet.applicant_name}님을 ${interviewStatusTitle(status)}(으)로 옮겼습니다.`,
      );
      return sheet;
    } catch (error) {
      toast.error(await handleApiError(error));
      await load();
      return null;
    }
  };

  const passedCount = board?.cards.filter((card) => card.status === "PASSED").length ?? 0;
  const undecidedCount = board?.cards.filter(
    (card) => card.status !== "PASSED" && card.status !== "FAILED",
  ).length ?? 0;

  const finalizeResults = async () => {
    if (!board || board.results_finalized || finalizing || board.cards.length === 0 || undecidedCount > 0) return;
    const confirmed = await confirmDialog({
      title: "면접 결과 최종 확정",
      description: "모든 지원자의 합격/불합격 결과를 확정합니다. 확정 후에는 결과와 합격 부서를 변경할 수 없습니다.",
      confirmLabel: "최종 확정",
    });
    if (!confirmed) return;
    setFinalizing(true);
    try {
      setBoard(await finalizeStaffInterviewResults(recruitmentId));
      toast.success("면접 결과를 최종 확정했습니다.");
    } catch (error) {
      toast.error(await handleApiError(error));
      await load();
    } finally {
      setFinalizing(false);
    }
  };

  /** 발표 시점에 합격자를 차기 운영진 명단에 한 번에 올린다. 이미 올라간 사람은 서버가 건너뛴다. */
  const registerStaff = async () => {
    if (!board?.results_finalized || registering || passedCount === 0) return;
    const confirmed = await confirmDialog({
      title: "합격자 운영진 등록",
      description: `합격자 ${passedCount}명을 이 모집 회차의 활동 학기 운영진 명단에 합격 부서, 팀원 직급으로 올립니다. 회장·부회장·팀장은 운영진 목록의 차기 탭에서 지정해 주세요. 운영진 명단은 사이트 운영진 소개에 쓰이니 발표 뒤에 눌러 주세요. 이미 명단에 있는 사람은 건너뜁니다.`,
      confirmLabel: "등록",
    });
    if (!confirmed) return;
    setRegistering(true);
    try {
      const result = await registerPassedApplicantsAsStaff(recruitmentId);
      // 등록한 학기 명단으로 바로 넘어가 확인할 수 있게 한다. 차기 학기면 운영진 목록의 차기 탭이다.
      const goToRoster = await confirmDialog({
        title: "합격자 운영진 등록 완료",
        description: registrationResultMessage(result),
        confirmLabel: "운영진 명단 보기",
      });
      if (goToRoster) router.push(registrationRosterHref(result));
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setRegistering(false);
    }
  };

  if (!board) {
    return <p className="text-muted-foreground text-sm">면접자를 불러오는 중입니다.</p>;
  }

  return (
    <section className="space-y-4" aria-labelledby="interview-board-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="interview-board-heading" className="text-lg font-bold">
            면접자
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {board.results_finalized
              ? "면접 결과가 최종 확정되었습니다. 합격자를 차기 운영진 명단에 등록할 수 있습니다."
              : `카드를 눌러 면접 기록을 적고, 모든 지원자의 결과를 정한 뒤 최종 확정하세요.${undecidedCount > 0 ? ` 미결정 ${undecidedCount}명` : ""}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={board.results_finalized || finalizing || board.cards.length === 0 || undecidedCount > 0}
            onClick={() => void finalizeResults()}
          >
            {board.results_finalized ? "면접 결과 확정됨" : "면접 결과 최종 확정"}
          </Button>
          <Button
            disabled={!board.results_finalized || registering || passedCount === 0}
            title={!board.results_finalized ? "면접 결과를 먼저 최종 확정해 주세요." : passedCount === 0 ? "합격자가 없습니다." : undefined}
            onClick={() => void registerStaff()}
          >
            합격자 운영진 등록
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {INTERVIEW_COLUMNS.map((column) => {
          const cards = groups[column.status];
          return (
            <div
              key={column.status}
              role="region"
              aria-label={`${column.title} ${cards.length}명`}
              className={cn(
                "bg-muted/40 flex min-h-48 flex-col gap-3 rounded-lg border p-3 transition-colors",
                dragOver === column.status && "border-foreground bg-muted",
              )}
              onDragOver={(event) => {
                if (board.results_finalized) return;
                if (!event.dataTransfer.types.includes(DRAG_TYPE)) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDragOver(column.status);
              }}
              onDragLeave={(event) => {
                // 칸 안의 카드 위로 지나갈 때는 강조를 끄지 않는다.
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setDragOver(null);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(null);
                if (board.results_finalized) return;
                const applicationId = Number(event.dataTransfer.getData(DRAG_TYPE));
                if (applicationId) void changeStatus(applicationId, column.status);
              }}
            >
              <h3 className="flex items-center justify-between px-1 text-sm font-semibold">
                {column.title}
                <span className="text-muted-foreground font-normal">{cards.length}</span>
              </h3>
              {cards.length === 0 ? (
                <p className="text-muted-foreground px-1 py-6 text-center text-xs">비어 있습니다.</p>
              ) : (
                cards.map((card) => (
                  <InterviewCard
                    key={card.application_id}
                    card={card}
                    slotMinutes={board.slot_minutes}
                    resultsFinalized={board.results_finalized}
                    onOpen={() => setOpenId(card.application_id)}
                    onChangeStatus={(status) => void changeStatus(card.application_id, status)}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>

      <StaffInterviewSheetPanel
        recruitmentId={recruitmentId}
        applicationId={openId}
        reloadKey={questionsVersion}
        requiredQuestionIds={requiredQuestionIds}
        resultsFinalized={board.results_finalized}
        onClose={() => setOpenId(null)}
        onStatusChange={changeStatus}
      />
      {passPicker.dialog}
    </section>
  );
}

function InterviewCard({
  card,
  slotMinutes,
  resultsFinalized,
  onOpen,
  onChangeStatus,
}: {
  card: StaffInterviewCard;
  slotMinutes: number | null;
  resultsFinalized: boolean;
  onOpen: () => void;
  onChangeStatus: (status: StaffInterviewStatus) => void;
}) {
  const department = (name: string | null) => (name ? formatStaffRecruitmentDepartment(name) : "-");
  return (
    <article
      draggable={!resultsFinalized}
      onDragStart={(event) => {
        if (resultsFinalized) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData(DRAG_TYPE, String(card.application_id));
        event.dataTransfer.effectAllowed = "move";
      }}
      className={cn("bg-background rounded-md border shadow-sm", !resultsFinalized && "cursor-grab active:cursor-grabbing")}
    >
      <button
        type="button"
        onClick={onOpen}
        className="hover:bg-muted/60 focus-visible:ring-ring block w-full rounded-md p-3 text-left focus-visible:outline-none focus-visible:ring-2"
        aria-label={`${card.applicant_name} 면접 기록 열기`}
      >
        <p className="font-semibold">{card.applicant_name}</p>
        <p className="text-muted-foreground mt-1 text-xs">{formatInterviewSlot(card.assigned_slot, slotMinutes)}</p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs">
          <dt className="text-muted-foreground">1지망</dt>
          <dd>{department(card.first_department)}</dd>
          <dt className="text-muted-foreground">2지망</dt>
          <dd>{department(card.second_department)}</dd>
          {card.passed_department && (
            <>
              <dt className="text-muted-foreground">합격 부서</dt>
              <dd className="font-semibold">{department(card.passed_department.department_name)}</dd>
            </>
          )}
        </dl>
      </button>
      {card.status === "DONE" && (
        <div className="flex gap-2 border-t p-2">
          <Button size="sm" variant="outline" className="flex-1" disabled={resultsFinalized} onClick={() => onChangeStatus("FAILED")}>
            불합격
          </Button>
          <Button size="sm" className="flex-1" disabled={resultsFinalized} onClick={() => onChangeStatus("PASSED")}>
            합격
          </Button>
        </div>
      )}
    </article>
  );
}
