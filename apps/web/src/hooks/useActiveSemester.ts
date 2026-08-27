"use client";

import { useEffect, useState } from "react";
import {
  fallbackSemester,
  getCurrentSemester,
  type Semester,
} from "@/features/semester/api";

/**
 * 운영진이 지정한 활동 학기.
 *
 * 학기는 원래 날짜로 계산하면 안 된다. 개강 전에 다음 학기 스터디를 열거나
 * 종강 후에도 지난 학기를 노출해야 하는 경우가 있어, 실제 활동 학기와
 * 달력이 어긋나기 때문이다.
 *
 * 다만 학기 API가 아직 배포되지 않은 환경도 있으므로, 서버 응답 전과
 * 조회 실패 시에는 날짜 계산값으로 버틴다. (getCurrentSemester가 실패를
 * 내부에서 흡수해 폴백값을 돌려준다.)
 */
export function useActiveSemester(): Semester {
  const [semester, setSemester] = useState<Semester>(fallbackSemester);

  useEffect(() => {
    let canceled = false;

    getCurrentSemester().then((current) => {
      if (!canceled) setSemester(current);
    });

    return () => {
      canceled = true;
    };
  }, []);

  return semester;
}
