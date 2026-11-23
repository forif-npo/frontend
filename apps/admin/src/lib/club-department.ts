/** 운영진 부서의 저장값에는 표시용 접미사 "팀"을 넣지 않는다. */
export function normalizeClubDepartment(name: string): string {
  return name.trim().replace(/팀$/, "").trim();
}

export function formatClubDepartment(name: string): string {
  const normalized = normalizeClubDepartment(name);
  if (!normalized || ["회장", "부회장", "회장단", "운영진"].includes(normalized)) return normalized;
  return `${normalized}팀`;
}
