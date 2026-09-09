import { describe, expect, it } from "@jest/globals";
import {
  buildAlimTalkVariables,
  formatPhoneNumberLines,
  formatReceiverLine,
  getMissingTemplateVariables,
  getRequiredTemplateVariables,
  getTemplateVariables,
  getVariableLabel,
  sortAlimTalkTemplatesByNameDescending,
} from "./sms-utils";
import type { AlimTalkTemplate, Receiver } from "./types";

const template: AlimTalkTemplate = {
  templateId: "template-1",
  name: "스터디 안내",
  content: "#{이름}님, #{스터디명}은 #{일시}에 시작합니다.",
  status: "APPROVED",
  messageType: "BA",
  dateCreated: null,
  dateUpdated: null,
  variables: ["#{이름}", "#{스터디명}"],
  buttonLinks: ["https://forif.org/#{url}", "#{일시}"],
};

describe("sms utils", () => {
  it("keeps template variables in their existing order and excludes the auto-filled name", () => {
    const variables = getTemplateVariables(template);

    expect(variables).toEqual(["#{이름}", "#{스터디명}", "#{일시}", "#{url}"]);
    expect(getRequiredTemplateVariables(variables)).toEqual([
      "#{스터디명}",
      "#{일시}",
      "#{url}",
    ]);
  });

  it("formats receiver lines and preserves receiver-list text around phone numbers", () => {
    const receiver: Receiver = {
      userId: 1,
      name: "홍길동",
      phoneNumber: "01011112222",
      department: "컴퓨터소프트웨어학부",
      currentStudyName: null,
    };

    expect(formatReceiverLine(receiver)).toBe(
      "홍길동, 010-1111-2222, 컴퓨터소프트웨어학부",
    );
    expect(
      formatPhoneNumberLines(
        "01011112222\n홍길동, 010-3333-4444, 컴퓨터소프트웨어학부",
      ),
    ).toBe("010-1111-2222\n홍길동, 010-3333-4444, 컴퓨터소프트웨어학부");
  });

  it("validates and builds only required variables with trimmed values", () => {
    const requiredVariables = ["#{스터디명}", "#{장소}"];
    const values = { "#{스터디명}": " React ", "#{장소}": "  " };

    expect(getMissingTemplateVariables(requiredVariables, values)).toEqual([
      "#{장소}",
    ]);
    expect(buildAlimTalkVariables(requiredVariables, values)).toEqual({
      "#{스터디명}": "React",
      "#{장소}": "",
    });
    expect(getVariableLabel("#{응답일정}")).toBe("응답 기한");
    expect(getVariableLabel("#{사용자정의}")).toBe("#{사용자정의}");
  });

  it("sorts every template by name in descending order", () => {
    const templates = [
      { ...template, templateId: "unprefixed", name: "운영진 공지" },
      { ...template, templateId: "24-2-a", name: "[24-2] 합격 문자" },
      { ...template, templateId: "26-1", name: "[26-1] 안내 문자" },
      { ...template, templateId: "26-2-a", name: "[26-2] 합격 문자" },
      { ...template, templateId: "26-2-b", name: "[26-2] 미납 안내" },
    ];

    expect(
      sortAlimTalkTemplatesByNameDescending(templates).map(
        (item) => item.templateId,
      ),
    ).toEqual(["unprefixed", "26-2-a", "26-2-b", "26-1", "24-2-a"]);
    expect(templates[0]?.templateId).toBe("unprefixed");
  });
});
