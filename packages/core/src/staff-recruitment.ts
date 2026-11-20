export function staffRecruitmentStorageTitle(
  actYear: number,
  actSemester: number,
): string {
  return `${actYear}-${actSemester}`;
}

export function formatStaffRecruitmentTitle(
  actYear: number,
  actSemester: number,
): string {
  return `${actYear}년 ${actSemester}학기 운영진 모집`;
}

export function formatStaffRecruitmentDepartment(name: string): string {
  return name.endsWith("팀") ? name : `${name}팀`;
}
