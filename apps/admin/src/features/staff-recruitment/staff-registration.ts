import { toSemesterLabel } from "@core/api/semester";
import type { StaffRegistrationResult } from "@core/types/staff-recruitment";

/** 합격자 운영진 등록 결과를 한 줄로 알린다. 건너뛴 사람이 있으면 이름을 덧붙인다. */
export function registrationResultMessage(result: StaffRegistrationResult): string {
  const term = `${result.act_year}년 ${result.act_semester}학기`;
  const parts = [
    result.registered.length > 0
      ? `${term} 운영진 명단에 ${result.registered.length}명을 올렸습니다.`
      : `${term} 운영진 명단에 새로 올린 사람이 없습니다.`,
  ];
  if (result.already_members.length > 0) {
    parts.push(`이미 명단에 있음: ${result.already_members.join(", ")}`);
  }
  if (result.withdrawn.length > 0) {
    parts.push(`탈퇴해 올리지 못함: ${result.withdrawn.join(", ")}`);
  }
  return parts.join(" ");
}

/** 등록한 학기의 운영진 목록 주소. 운영진 목록은 "27-1" 형태 학기 값을 받는다. */
export function registrationRosterHref(result: Pick<StaffRegistrationResult, "act_year" | "act_semester">): string {
  return `/operators?semester=${toSemesterLabel(result.act_year, result.act_semester)}`;
}
