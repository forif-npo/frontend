import { describe, expect, it } from "@jest/globals";
import { EMPTY_MANUAL_CERTIFICATE_FORM, toManualCertificateBody, validateManualCertificateForm } from "./manual-certificate-form";

const completeForm = {
  ...EMPTY_MANUAL_CERTIFICATE_FORM,
  userName: " 홍길동 ",
  studentNumber: " 2026000001 ",
  department: " 컴퓨터소프트웨어학부 ",
  studyName: " React 심화 ",
  startDate: "2026-03-01",
  endDate: "2026-06-20",
};

describe("manual certificate form", () => {
  it("keeps the existing required-field and date-range messages", () => {
    expect(validateManualCertificateForm(EMPTY_MANUAL_CERTIFICATE_FORM)).toBe(
      "이름을 입력해주세요.",
    );
    expect(
      validateManualCertificateForm({
        ...completeForm,
        startDate: "2026-06-21",
      }),
    ).toBe("활동 시작일이 종료일보다 늦을 수 없습니다.");
  });

  it("converts display input to the existing API payload without changing values", () => {
    expect(
      toManualCertificateBody({
        ...completeForm,
        issueDate: "2026-06-21",
        presidentName: " 김포리 ",
      }),
    ).toEqual({
      user_name: "홍길동",
      student_number: "2026000001",
      department: "컴퓨터소프트웨어학부",
      study_name: "React 심화",
      activity_period: "2026.03.01.~2026.06.20.",
      issue_date: "2026. 06. 21.",
      president_name: "김포리",
    });
  });

  it("does not send optional issue date or president name when omitted", () => {
    expect(toManualCertificateBody(completeForm)).toMatchObject({
      issue_date: undefined,
      president_name: undefined,
    });
  });
});
