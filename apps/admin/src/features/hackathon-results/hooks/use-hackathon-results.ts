"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createEmptyDraft } from "../schema";
import { clearDraft, loadDraft, saveDraft, storageKey } from "../storage";
import type { HackathonResultDraft } from "../types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

const SAVE_DEBOUNCE_MS = 250;

interface UseHackathonResultsOptions {
  /** 발표 화면처럼 읽기만 하는 경우 자동 저장을 막는다. */
  readOnly?: boolean;
}

export interface UseHackathonResults {
  draft: HackathonResultDraft | null;
  hydrated: boolean;
  saveStatus: SaveStatus;
  loadError: string | null;
  /** 함수형 업데이트로 results 등을 변경한다. updatedAt은 자동 갱신한다. */
  updateDraft: (
    updater: (prev: HackathonResultDraft) => HackathonResultDraft,
  ) => void;
  /** import 등으로 전체 초안을 교체한다. */
  replaceDraft: (next: HackathonResultDraft) => void;
  /** 빈 초안으로 초기화한다. */
  resetDraft: () => void;
  dismissLoadError: () => void;
}

export function useHackathonResults(
  hackathonId: number,
  eventTitle: string,
  options: UseHackathonResultsOptions = {},
): UseHackathonResults {
  const { readOnly = false } = options;

  const [draft, setDraft] = useState<HackathonResultDraft | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const skipNextSaveRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    skipNextSaveRef.current = true;
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

  // ── debounce 저장 ──
  useEffect(() => {
    if (readOnly || !hydrated || draft === null) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    setSaveStatus("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const result = saveDraft(draft);
      setSaveStatus(result.ok ? "saved" : "error");
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, hydrated, readOnly]);

  // ── 다른 탭(편집 ↔ 발표) 동기화 ──
  useEffect(() => {
    const key = storageKey(hackathonId);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      const result = loadDraft(hackathonId);
      if (result.status === "ok") {
        skipNextSaveRef.current = true;
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

  const resetDraft = useCallback(() => {
    clearDraft(hackathonId);
    setDraft(createEmptyDraft(hackathonId, eventTitle));
    setLoadError(null);
  }, [hackathonId, eventTitle]);

  const dismissLoadError = useCallback(() => setLoadError(null), []);

  return {
    draft,
    hydrated,
    saveStatus,
    loadError,
    updateDraft,
    replaceDraft,
    resetDraft,
    dismissLoadError,
  };
}
