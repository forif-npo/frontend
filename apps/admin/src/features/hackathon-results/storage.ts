import { parseDraft } from "./schema";
import type { HackathonResultDraft } from "./types";

export function storageKey(hackathonId: number): string {
  return `forif:admin:hackathon-results:v1:${hackathonId}`;
}

export type LoadResult =
  | { status: "empty" }
  | { status: "ok"; draft: HackathonResultDraft }
  | { status: "corrupt"; message: string };

/** localStorage에서 결과 초안을 읽는다. 클라이언트에서만 호출한다. */
export function loadDraft(hackathonId: number): LoadResult {
  if (typeof window === "undefined") return { status: "empty" };

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(storageKey(hackathonId));
  } catch {
    return { status: "corrupt", message: "저장소에 접근할 수 없습니다." };
  }
  if (!raw) return { status: "empty" };

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return {
      status: "corrupt",
      message: "저장된 결과 데이터를 해석할 수 없습니다.",
    };
  }

  const parsed = parseDraft(json);
  if (!parsed.success) {
    return { status: "corrupt", message: parsed.error };
  }
  return { status: "ok", draft: parsed.draft };
}

export type SaveResult = { ok: true } | { ok: false; error: string };

export function saveDraft(draft: HackathonResultDraft): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, error: "브라우저 환경이 아닙니다." };
  }
  try {
    window.localStorage.setItem(
      storageKey(draft.hackathonId),
      JSON.stringify(draft),
    );
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "결과를 저장하지 못했습니다. 저장 공간이 부족할 수 있습니다.",
    };
  }
}

export function clearDraft(hackathonId: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey(hackathonId));
  } catch {
    // 무시: 비어 있는 것으로 간주한다.
  }
}
