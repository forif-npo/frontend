import { describe, expect, it } from "@jest/globals";

import {
  canEditOperator,
  canShowOperatorActions,
} from "./operator-permissions";

describe("운영진 목록 권한", () => {
  it("회장단은 모든 운영진 정보를 수정할 수 있고 액션을 본다", () => {
    expect(canShowOperatorActions(true, 20260001)).toBe(true);
    expect(canEditOperator(true, 20260001, 20260002)).toBe(true);
  });

  it("일반 운영진은 자신의 정보만 수정할 수 있다", () => {
    expect(canShowOperatorActions(false, 20260001)).toBe(true);
    expect(canEditOperator(false, 20260001, 20260001)).toBe(true);
    expect(canEditOperator(false, 20260001, 20260002)).toBe(false);
  });

  it("로그인하지 않은 사용자는 운영진 액션을 볼 수 없다", () => {
    expect(canShowOperatorActions(false, 0)).toBe(false);
  });
});
