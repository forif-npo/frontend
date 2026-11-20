/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import { HallOfFamePreview } from "./HallOfFamePreview";
import { emptyHallOfFameForm } from "./form";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { alt: string }) => (
    <span role="img" aria-label={props.alt} />
  ),
}));

describe("HallOfFamePreview", () => {
  it("keeps long content readable and shows the photo fallback", () => {
    const form = emptyHallOfFameForm();
    form.memberName = "아주 긴 이름을 가진 테스트 회원";
    form.title = "FORIF의 성장에 기여한 구성원";
    form.introduction = "긴 소개 문장입니다. ".repeat(20);
    form.badges = ["회장", "프로젝트 대상"];
    form.achievements = [
      { title: "대표 성취", description: "성과 설명", linkUrl: "" },
    ];

    render(<HallOfFamePreview form={form} imageUrl={null} />);

    expect(
      screen.getByRole("heading", { name: "아주 긴 이름을 가진 테스트 회원" }),
    ).toBeTruthy();
    expect(screen.getByText("등록된 사진이 없습니다")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "주요 성취" })).toBeTruthy();
    expect(screen.getByText("대표 성취")).toBeTruthy();
  });

  it("uses the member name as the image alternative text", () => {
    const form = emptyHallOfFameForm();
    form.memberName = "테스트 회원";
    render(
      <HallOfFamePreview
        form={form}
        imageUrl="https://example.com/photo.jpg"
      />,
    );
    expect(
      screen.getByRole("img", { name: "테스트 회원 미리보기" }),
    ).toBeTruthy();
  });
});
