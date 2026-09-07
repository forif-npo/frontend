import { useCallback, useEffect, useMemo, useState } from "react";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { mergeSelectedMembers } from "./dues-utils";
import type { DuesMember } from "./types";

interface UseDuesSelectionParams {
  pageMembers: DuesMember[];
  resetKey: string;
}

/** 회비 대상의 페이지 간 선택과, 검색·필터 변경 시 선택 초기화를 관리한다. */
export function useDuesSelection({
  pageMembers,
  resetKey,
}: UseDuesSelectionParams) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedMembersById, setSelectedMembersById] = useState<
    Map<number, DuesMember>
  >(new Map());

  useEffect(() => {
    setRowSelection({});
    setSelectedMembersById(new Map());
  }, [resetKey]);

  const selectedMembers = useMemo(
    () => Array.from(selectedMembersById.values()),
    [selectedMembersById],
  );

  const updateRowSelection = useCallback<OnChangeFn<RowSelectionState>>(
    (updater) => {
      setRowSelection((currentSelection) => {
        const nextSelection =
          typeof updater === "function" ? updater(currentSelection) : updater;

        setSelectedMembersById((currentMembers) =>
          mergeSelectedMembers(currentMembers, pageMembers, nextSelection),
        );

        return nextSelection;
      });
    },
    [pageMembers],
  );

  const clearSelection = useCallback(() => {
    setRowSelection({});
    setSelectedMembersById(new Map());
  }, []);

  return {
    rowSelection,
    selectedMembers,
    updateRowSelection,
    clearSelection,
  };
}
