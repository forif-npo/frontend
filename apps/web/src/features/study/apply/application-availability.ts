import type { StudyApplicationStatusResponse } from "./api";

export const FULL_STUDY_APPLICATION_MESSAGE =
  "이미 1·2순위 스터디 신청을 완료했습니다.\n마이페이지에서 지원서를 확인해주세요.";

export const AUTONOMOUS_STUDY_CONFLICT_MESSAGE =
  "자율스터디는 정규스터디와 중복 신청할 수 없습니다.";

export const DUPLICATE_PRIORITY_STUDY_MESSAGE =
  "이미 1순위로 지원한 스터디입니다.\n2순위는 다른 스터디를 선택해주세요.";

export function getStudyApplicationBlockMessage(
  status: StudyApplicationStatusResponse,
  isAutonomousStudy: boolean,
  studyId?: number,
) {
  if (
    status.has_autonomous_study_application ||
    (isAutonomousStudy && !status.can_apply_autonomous_study)
  ) {
    return AUTONOMOUS_STUDY_CONFLICT_MESSAGE;
  }

  if (studyId !== undefined && status.primary_study?.id === studyId) {
    return DUPLICATE_PRIORITY_STUDY_MESSAGE;
  }

  if (!status.can_apply_primary && !status.can_apply_secondary) {
    return FULL_STUDY_APPLICATION_MESSAGE;
  }

  return null;
}
