import { describe, expect, it } from "@jest/globals";
import {
  EMPTY_PRODUCT_APPLICATION_FORM,
  toProductApplicationRequest,
  validateProductApplicationForm,
} from "./product-application-form";

const validForm = {
  ...EMPTY_PRODUCT_APPLICATION_FORM,
  name: "FORIF 서비스",
  slug: "forif-service",
  oneLiner: "동아리 서비스",
  description: "서비스 상세 설명",
};

describe("product application form", () => {
  it("requires all mandatory fields and a thumbnail for a new application", () => {
    expect(
      validateProductApplicationForm({
        form: EMPTY_PRODUCT_APPLICATION_FORM,
        thumbnail: null,
        isExistingThumbnailRemoved: false,
      }),
    ).toEqual({
      name: "서비스 이름을 입력해주세요.",
      slug: "희망 서브도메인을 입력해주세요.",
      oneLiner: "한 줄 소개를 입력해주세요.",
      description: "상세 소개를 입력해주세요.",
      thumbnail: "썸네일을 등록해주세요.",
    });
  });

  it("normalizes reserved slugs before rejecting them", () => {
    expect(
      validateProductApplicationForm({
        form: { ...validForm, slug: "  ADMIN  " },
        thumbnail: new File(["thumbnail"], "thumbnail.png", {
          type: "image/png",
        }),
        isExistingThumbnailRemoved: false,
      }),
    ).toEqual({ slug: '"admin"는 사용할 수 없는 예약된 주소입니다.' });
  });

  it("accepts an existing thumbnail but keeps URL validation errors", () => {
    expect(
      validateProductApplicationForm({
        form: {
          ...validForm,
          serviceUrl: "forif.org",
          githubUrl: "github.com/forif",
        },
        thumbnail: null,
        existingThumbnailUrl: "https://cdn.forif.org/thumbnail.png",
        isExistingThumbnailRemoved: false,
      }),
    ).toEqual({
      serviceUrl: "http:// 또는 https:// 로 시작하는 주소를 입력해주세요.",
      githubUrl: "http:// 또는 https:// 로 시작하는 주소를 입력해주세요.",
    });
  });

  it("trims user input and drops empty tags and tech stacks from the API request", () => {
    expect(
      toProductApplicationRequest({
        ...validForm,
        name: " FORIF 서비스 ",
        slug: " FORIF-SERVICE ",
        serviceUrl: "  ",
        githubUrl: " https://github.com/forif ",
        tags: " React, , TypeScript ",
        techStack: " Next.js, , Spring ",
      }),
    ).toEqual({
      name: "FORIF 서비스",
      slug: "forif-service",
      one_liner: "동아리 서비스",
      description: "서비스 상세 설명",
      source_type: "STUDY",
      service_url: null,
      github_url: "https://github.com/forif",
      tags: ["React", "TypeScript"],
      tech_stack: ["Next.js", "Spring"],
    });
  });
});
