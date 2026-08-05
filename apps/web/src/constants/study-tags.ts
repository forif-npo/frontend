export const STUDY_TAG_OPTIONS = [
  { id: 1, name: "database", label: "데이터베이스" },
  { id: 2, name: "basic", label: "프로그래밍 기초" },
  { id: 3, name: "frontend", label: "프론트엔드" },
  { id: 4, name: "backend", label: "백엔드" },
  { id: 5, name: "fullstack", label: "풀스택" },
  { id: 6, name: "app", label: "앱" },
  { id: 7, name: "ai", label: "인공지능" },
  { id: 8, name: "data", label: "데이터" },
  { id: 9, name: "security", label: "보안" },
  { id: 10, name: "game", label: "게임" },
  { id: 11, name: "design", label: "디자인" },
  { id: 12, name: "algorithm", label: "알고리즘" },
  { id: 13, name: "blockchain", label: "블록체인" },
] as const;

const LEGACY_LABELS: Record<string, (typeof STUDY_TAG_OPTIONS)[number]> = {
  개인개발: STUDY_TAG_OPTIONS[4],
  모바일: STUDY_TAG_OPTIONS[5],
  "프로그래밍 언어 기초": STUDY_TAG_OPTIONS[1],
};

export const TAG_OPTIONS = STUDY_TAG_OPTIONS.map((tag) => tag.label);

function findStudyTag(value: string) {
  return (
    STUDY_TAG_OPTIONS.find(
      (option) => option.name === value || option.label === value,
    ) ?? LEGACY_LABELS[value]
  );
}

export function getStudyTagId(label: string): number | null {
  return findStudyTag(label)?.id ?? null;
}

export function getStudyTagName(label: string): string | null {
  return findStudyTag(label)?.name ?? null;
}

export function getStudyTagLabel(value: string): string {
  return findStudyTag(value)?.label ?? value;
}
