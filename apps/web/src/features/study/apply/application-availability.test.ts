import { describe, expect, it } from "@jest/globals";

import {
  AUTONOMOUS_STUDY_CONFLICT_MESSAGE,
  DUPLICATE_AUTONOMOUS_STUDY_MESSAGE,
  DUPLICATE_PRIORITY_STUDY_MESSAGE,
  FULL_STUDY_APPLICATION_MESSAGE,
  getStudyApplicationBlockMessage,
} from "./application-availability";
import type { StudyApplicationStatusResponse } from "./api";

const availableStatus: StudyApplicationStatusResponse = {
  can_apply_primary: true,
  can_apply_secondary: true,
  can_apply_autonomous_study: true,
  has_autonomous_study_application: false,
  primary_study: null,
  secondary_study: null,
};

describe("getStudyApplicationBlockMessage", () => {
  it("신청 가능한 경우 차단 메시지를 반환하지 않는다", () => {
    expect(
      getStudyApplicationBlockMessage(availableStatus, false, 101),
    ).toBeNull();
  });

  it("자율부원 신청 이력이 있으면 정규 스터디와 자율부원 재신청을 각각 차단한다", () => {
    const status = {
      ...availableStatus,
      has_autonomous_study_application: true,
    };

    expect(getStudyApplicationBlockMessage(status, false, 101)).toBe(
      AUTONOMOUS_STUDY_CONFLICT_MESSAGE,
    );
    expect(getStudyApplicationBlockMessage(status, true, 101)).toBe(
      DUPLICATE_AUTONOMOUS_STUDY_MESSAGE,
    );
  });

  it("자율부원과 정규 스터디의 중복 불가 정책을 유지한다", () => {
    expect(
      getStudyApplicationBlockMessage(
        { ...availableStatus, can_apply_autonomous_study: false },
        true,
        101,
      ),
    ).toBe(AUTONOMOUS_STUDY_CONFLICT_MESSAGE);
  });

  it("같은 1순위 스터디로의 재신청을 차단한다", () => {
    expect(
      getStudyApplicationBlockMessage(
        { ...availableStatus, primary_study: { id: 101 } },
        false,
        101,
      ),
    ).toBe(DUPLICATE_PRIORITY_STUDY_MESSAGE);
  });

  it("1순위와 2순위 신청이 모두 불가하면 전체 신청 완료로 처리한다", () => {
    expect(
      getStudyApplicationBlockMessage(
        {
          ...availableStatus,
          can_apply_primary: false,
          can_apply_secondary: false,
        },
        false,
        101,
      ),
    ).toBe(FULL_STUDY_APPLICATION_MESSAGE);
  });
});
