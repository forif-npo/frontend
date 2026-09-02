"use client";

import { InlineErrorState, InlineLoadingState } from "@ui/components/server";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MemberHistory } from "./api";
import type { Member } from "./types";

interface MemberHistoryDialogProps {
  member: Member | null;
  history: MemberHistory | null;
  isLoading: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

export function MemberHistoryDialog({
  member,
  history,
  isLoading,
  errorMessage,
  onClose,
}: MemberHistoryDialogProps) {
  return (
    <Dialog
      open={member !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>부원 이력 상세</DialogTitle>
          <DialogDescription>
            멘토와 운영진으로 활동한 이력을 확인합니다.
          </DialogDescription>
        </DialogHeader>

        {member && (
          <Table>
            <TableBody>
              <InfoRow label="이름" value={member.userName} />
              <InfoRow label="학번" value={String(member.userId)} />
              <InfoRow label="학과" value={member.department} />
            </TableBody>
          </Table>
        )}

        {isLoading ? (
          <InlineLoadingState
            message="이력을 불러오는 중입니다."
            className="py-12"
            textToneClassName="text-muted-foreground"
          />
        ) : errorMessage ? (
          <InlineErrorState
            message={errorMessage}
            className="py-12"
            textToneClassName="text-destructive"
          />
        ) : history ? (
          <div className="space-y-7">
            {member?.isAdmin && (
              <HistorySection title="운영진 이력">
                {history.operators.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>학기</TableHead>
                        <TableHead>소속 팀</TableHead>
                        <TableHead>직책</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.operators.map((operator) => (
                        <TableRow
                          key={`${operator.actYear}-${operator.actSemester}-${operator.team}-${operator.title}`}
                        >
                          <TableCell>{formatSemester(operator)}</TableCell>
                          <TableCell>{operator.team || "-"}</TableCell>
                          <TableCell>{operator.title || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyHistory />
                )}
              </HistorySection>
            )}

            {member?.isMentor && (
              <HistorySection title="멘토 이력">
                {history.mentors.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>학기</TableHead>
                        <TableHead>스터디</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.mentors.map((mentor) => (
                        <TableRow
                          key={`${mentor.actYear}-${mentor.actSemester}-${mentor.studyName}`}
                        >
                          <TableCell>{formatSemester(mentor)}</TableCell>
                          <TableCell>{mentor.studyName || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyHistory />
                )}
              </HistorySection>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <TableRow>
      <TableHead className="w-24">{label}</TableHead>
      <TableCell>{value || "-"}</TableCell>
    </TableRow>
  );
}

function HistorySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function EmptyHistory() {
  return (
    <p className="text-muted-foreground py-3 text-sm">
      표시할 이력이 없습니다.
    </p>
  );
}

function formatSemester({
  actYear,
  actSemester,
}: {
  actYear: number;
  actSemester: number;
}) {
  return actYear && actSemester ? `${actYear}-${actSemester}` : "-";
}
