import { describe, expect, it } from "@jest/globals";
import {
  emptyHallOfFameForm,
  toHallOfFameSaveRequest,
  validateHallOfFameForm,
} from "./form";

describe("hall of fame form", () => {
  it("requires a selected member and a safe slug", () => {
    const form = emptyHallOfFameForm();
    form.slug = "잘못된-slug";
    expect(validateHallOfFameForm(form)).toContain("회원");

    form.userId = "2099999999";
    form.memberName = "테스트 회원";
    form.title = "FORIF 기여자";
    form.introduction = "소개";
    expect(validateHallOfFameForm(form)).toContain("slug");
  });

  it("maps ordered badges and achievements to snake_case", () => {
    const form = emptyHallOfFameForm();
    Object.assign(form, {
      userId: "2099999999",
      memberName: "테스트 회원",
      slug: "test-member",
      actYear: "2026",
      actSemester: "2",
      title: " FORIF 기여자 ",
      introduction: " 소개 ",
      badges: [" 회장 ", "대상"],
      displayOrder: "3",
    });
    form.achievements = [
      {
        title: " 프로젝트 대상 ",
        description: " 설명 ",
        linkUrl: "https://example.com/result",
      },
    ];

    expect(validateHallOfFameForm(form)).toBeNull();
    expect(toHallOfFameSaveRequest(form)).toEqual({
      user_id: 2099999999,
      slug: "test-member",
      act_year: 2026,
      act_semester: 2,
      title: "FORIF 기여자",
      introduction: "소개",
      badges: [
        { label: "회장", display_order: 1 },
        { label: "대상", display_order: 2 },
      ],
      achievements: [
        {
          title: "프로젝트 대상",
          description: "설명",
          link_url: "https://example.com/result",
          display_order: 1,
        },
      ],
      display_order: 3,
    });
  });

  it("rejects non-https achievement links", () => {
    const form = emptyHallOfFameForm();
    Object.assign(form, {
      userId: "2099999999",
      memberName: "테스트 회원",
      slug: "test-member",
      title: "기여자",
      introduction: "소개",
    });
    form.achievements = [
      { title: "성과", description: "", linkUrl: "http://example.com" },
    ];
    expect(validateHallOfFameForm(form)).toContain("https");
  });
});
