import type { RowSelectionState } from "@tanstack/react-table";
import type { DuesMember, DuesSummary, UpdateDuesPayload } from "./types";

export type DuesStatusField = "duesPaid" | "googleFormSubmitted";

/** 현재 페이지에서 바뀐 선택만 반영하고, 다른 페이지의 선택은 유지한다. */
export function mergeSelectedMembers(
  selectedMembersById: Map<number, DuesMember>,
  pageMembers: DuesMember[],
  rowSelection: RowSelectionState,
): Map<number, DuesMember> {
  const nextMembers = new Map(selectedMembersById);

  pageMembers.forEach((member) => {
    if (rowSelection[String(member.userId)]) {
      if (!nextMembers.has(member.userId)) {
        nextMembers.set(member.userId, member);
      }
      return;
    }

    nextMembers.delete(member.userId);
  });

  return nextMembers;
}

export function createDuesUpdates(
  members: DuesMember[],
  field: DuesStatusField,
  value: boolean,
): UpdateDuesPayload[] {
  return members.map((member) => ({
    userId: member.userId,
    [field]: value,
  }));
}

export function getDuesOutstandingCounts(summary: DuesSummary) {
  return {
    formNotSubmitted: summary.totalCount - summary.googleFormSubmittedCount,
    duesNotPaid: summary.totalCount - summary.duesPaidCount,
  };
}
