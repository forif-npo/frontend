import { describe, expect, it } from "@jest/globals";
import { registrationResultMessage } from "./staff-registration";

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
