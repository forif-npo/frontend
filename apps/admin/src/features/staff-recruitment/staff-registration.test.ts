import { describe, expect, it, jest } from "@jest/globals";

// 학기 표기 함수와 같은 파일에 있는 API 클라이언트가 ESM 전용 ky를 불러와서 막아 둔다.
jest.mock("@core/utils/api-client", () => ({ apiClient: {} }));
import { registrationResultMessage, registrationRosterHref } from "./staff-registration";

describe("registrationResultMessage", () => {
  it("올린 인원과 학기를 알린다", () => {
    expect(
      registrationResultMessage({
        act_year: 2027,
        act_semester: 1,
        registered: ["가", "나"],
        already_members: [],
        withdrawn: [],
      }),
    ).toBe("2027년 1학기 운영진 명단에 2명을 올렸습니다.");
  });

  it("건너뛴 사람은 이유별로 이름을 덧붙인다", () => {
    expect(
      registrationResultMessage({
        act_year: 2027,
        act_semester: 1,
        registered: [],
        already_members: ["다"],
        withdrawn: ["라"],
      }),
    ).toBe(
      "2027년 1학기 운영진 명단에 새로 올린 사람이 없습니다. 이미 명단에 있음: 다 탈퇴해 올리지 못함: 라",
    );
  });
});

describe("registrationRosterHref", () => {
  it("등록한 학기의 운영진 목록으로 보낸다", () => {
    expect(registrationRosterHref({ act_year: 2027, act_semester: 1 })).toBe("/operators?semester=27-1");
  });
});
