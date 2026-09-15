"use client";
import { useCallback, useEffect, useState } from "react";
import { createEmptyDraft } from "../schema";
import { loadDraft, saveDraft as persistDraft, type SaveResult, storageKey } from "../storage";
import type { HackathonResultDraft } from "../types";

export interface UseHackathonResults {
  draft: HackathonResultDraft | null;
  hydrated: boolean;
  loadError: string | null;
  /** 함수형 업데이트로 results 등을 변경한다. updatedAt은 자동 갱신한다. */
  updateDraft: (
    updater: (prev: HackathonResultDraft) => HackathonResultDraft,
  ) => void;
  /** import 등으로 전체 초안을 교체한다. */
  replaceDraft: (next: HackathonResultDraft) => void;
  /** 현재 편집 중인 초안을 저장소에 반영한다. */
  saveDraft: () => SaveResult;
  /** 현재 편집 중인 초안을 빈 상태로 초기화한다. */
  resetDraft: () => void;
  dismissLoadError: () => void;
}

export function useHackathonResults(
  hackathonId: number,
  eventTitle: string,
): UseHackathonResults {
  const [draft, setDraft] = useState<HackathonResultDraft | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── 최초 hydration (클라이언트에서만 localStorage 접근) ──
  useEffect(() => {
    const result = loadDraft(hackathonId);
    if (result.status === "ok") {
      setDraft(result.draft);
    } else if (result.status === "corrupt") {
      setLoadError(result.message);
      setDraft(createEmptyDraft(hackathonId, eventTitle));
    } else {
      setDraft(createEmptyDraft(hackathonId, eventTitle));
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

  // ── 다른 탭(편집 ↔ 발표) 동기화 ──
  useEffect(() => {
    const key = storageKey(hackathonId);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      const result = loadDraft(hackathonId);
      if (result.status === "ok") {
        setDraft(result.draft);
        setLoadError(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hackathonId]);

  const updateDraft = useCallback(
    (updater: (prev: HackathonResultDraft) => HackathonResultDraft) => {
      setDraft((prev) => {
        if (prev === null) return prev;
        const next = updater(prev);
        return { ...next, updatedAt: new Date().toISOString() };
      });
    },
    [],
  );

  const replaceDraft = useCallback(
    (next: HackathonResultDraft) => {
      setDraft({
        ...next,
        hackathonId,
        updatedAt: new Date().toISOString(),
      });
      setLoadError(null);
    },
    [hackathonId],
  );

  const saveDraft = useCallback((): SaveResult => {
    if (draft === null) {
      return { ok: false, error: "결과 데이터를 불러오는 중입니다." };
    }

    return persistDraft(draft);
  }, [draft]);

  const resetDraft = useCallback(() => {
    setDraft(createEmptyDraft(hackathonId, eventTitle));
    setLoadError(null);
  }, [hackathonId, eventTitle]);

  const dismissLoadError = useCallback(() => setLoadError(null), []);

  return {
    draft,
    hydrated,
    loadError,
    updateDraft,
    replaceDraft,
    saveDraft,
    resetDraft,
    dismissLoadError,
  };
}
