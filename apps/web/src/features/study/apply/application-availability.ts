import type { StudyApplicationStatusResponse } from "@core/my-page/api";

export const FULL_STUDY_APPLICATION_MESSAGE =
  "이미 1·2순위 스터디 신청을 완료했습니다. 마이페이지에서 지원서를 확인해주세요.";

export const AUTONOMOUS_STUDY_CONFLICT_MESSAGE =
  "자율스터디는 정규스터디와 중복 신청할 수 없습니다.";

export function getStudyApplicationBlockMessage(
  status: StudyApplicationStatusResponse,
  isAutonomousStudy: boolean,
) {
  if (
    status.has_autonomous_study_application ||
    (isAutonomousStudy && !status.can_apply_autonomous_study)
  ) {
    return AUTONOMOUS_STUDY_CONFLICT_MESSAGE;
  }

  if (!status.can_apply_primary && !status.can_apply_secondary) {
    return FULL_STUDY_APPLICATION_MESSAGE;
  }

  return null;
}
