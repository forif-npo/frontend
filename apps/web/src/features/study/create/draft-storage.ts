import type { StudyOpenValues } from "@core/schemas";

const STUDY_CREATE_DRAFT_STORAGE_KEY = "study-create-draft";
const STUDY_CREATE_DRAFT_VERSION = 1;
const STUDY_CREATE_DRAFT_SOURCE = "manual";

type StudyCreateDraftValues = Omit<StudyOpenValues, "thumbnail">;

type StudyCreateDraftPayload = {
  version: typeof STUDY_CREATE_DRAFT_VERSION;
  source: typeof STUDY_CREATE_DRAFT_SOURCE;
  savedAt: string;
  values: Partial<StudyCreateDraftValues>;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toDraftValues(values: Partial<StudyOpenValues>) {
  const { thumbnail: _thumbnail, ...draftValues } = values;
  return draftValues;
}

function isDraftPayload(value: unknown): value is StudyCreateDraftPayload {
  return (
    isRecord(value) &&
    value.version === STUDY_CREATE_DRAFT_VERSION &&
    value.source === STUDY_CREATE_DRAFT_SOURCE &&
    isRecord(value.values)
  );
}

function hasDraftContent(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasDraftContent);
  }

  if (isRecord(value)) {
    return Object.values(value).some(hasDraftContent);
  }

  return (
    value !== "" && value !== null && value !== undefined && value !== false
  );
}

export function saveStudyCreateDraft(values: Partial<StudyOpenValues>) {
  if (!isBrowser()) return false;

  const draftValues = toDraftValues(values);
  if (!hasDraftContent(draftValues)) return false;

  const payload: StudyCreateDraftPayload = {
    version: STUDY_CREATE_DRAFT_VERSION,
    source: STUDY_CREATE_DRAFT_SOURCE,
    savedAt: new Date().toISOString(),
    values: draftValues,
  };

  window.localStorage.setItem(
    STUDY_CREATE_DRAFT_STORAGE_KEY,
    JSON.stringify(payload),
  );

  return true;
}

export function loadStudyCreateDraft() {
  if (!isBrowser()) return null;

  const storedDraft = window.localStorage.getItem(
    STUDY_CREATE_DRAFT_STORAGE_KEY,
  );

  if (!storedDraft) return null;

  try {
    const parsedDraft: unknown = JSON.parse(storedDraft);

    if (isDraftPayload(parsedDraft)) {
      return parsedDraft.values;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearStudyCreateDraft() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(STUDY_CREATE_DRAFT_STORAGE_KEY);
}
