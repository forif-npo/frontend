"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { StaffInterviewBoard, StaffInterviewCard, StaffInterviewStatus } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toast";
import { changeStaffInterviewStatus, getStaffInterviewBoard } from "./api";
import { INTERVIEW_COLUMNS, formatInterviewSlot, groupInterviewCards, interviewStatusTitle, moveInterviewCard } from "./interview-board";
import { StaffInterviewSheetPanel } from "./StaffInterviewSheetPanel";

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

  /** 화면을 먼저 옮기고, 실패하면 서버 상태로 되돌린다. */
  const changeStatus = async (applicationId: number, status: StaffInterviewStatus) => {
    const current = board?.cards.find((card) => card.application_id === applicationId);
    if (!board || !current || current.status === status) return null;
    setBoard({ ...board, cards: moveInterviewCard(board.cards, applicationId, status) });
    try {
      const sheet = await changeStaffInterviewStatus(recruitmentId, applicationId, status);
      toast.success(`${sheet.applicant_name}님을 ${interviewStatusTitle(status)}(으)로 옮겼습니다.`);
      return sheet;
    } catch (error) {
      toast.error(await handleApiError(error));
      await load();
      return null;
    }
  };

  if (!board) {
    return <p className="text-muted-foreground text-sm">면접자를 불러오는 중입니다.</p>;
  }

  return (
    <section className="space-y-4" aria-labelledby="interview-board-heading">
      <div>
        <h2 id="interview-board-heading" className="text-lg font-bold">
          면접자
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          카드를 눌러 면접 기록을 적고, 끌어서 다른 칸으로 옮길 수 있습니다.
        </p>
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
        onClose={() => setOpenId(null)}
        onStatusChange={changeStatus}
      />
    </section>
  );
}

function InterviewCard({
  card,
  slotMinutes,
  onOpen,
  onChangeStatus,
}: {
  card: StaffInterviewCard;
  slotMinutes: number | null;
  onOpen: () => void;
  onChangeStatus: (status: StaffInterviewStatus) => void;
}) {
  const department = (name: string | null) => (name ? formatStaffRecruitmentDepartment(name) : "-");
  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData(DRAG_TYPE, String(card.application_id));
        event.dataTransfer.effectAllowed = "move";
      }}
      className="bg-background cursor-grab rounded-md border shadow-sm active:cursor-grabbing"
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
        </dl>
      </button>
      {card.status === "DONE" && (
        <div className="flex gap-2 border-t p-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onChangeStatus("FAILED")}>
            불합격
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onChangeStatus("PASSED")}>
            합격
          </Button>
        </div>
      )}
    </article>
  );
}
