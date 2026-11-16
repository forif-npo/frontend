/** @jest-environment jsdom */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import { ProfileSidebar } from "./ProfileSidebar";

const profile = {
  user_name: "테스트 회원",
  department: "예시 학과",
  user_id: 1,
  role: "USER",
  img_url: null,
};

describe("ProfileSidebar", () => {
  it("shows staff application management only when application history exists", () => {
    const onNavChange = jest.fn();
    const { rerender } = render(
      <ProfileSidebar
        profile={profile}
        activeNav="my-studies"
        onNavChange={onNavChange}
        canManageServiceWorkspace
      />,
    );

    expect(
      screen.queryByRole("button", { name: "운영진 지원 관리" }),
    ).toBeNull();

    rerender(
      <ProfileSidebar
        profile={profile}
        activeNav="my-studies"
        onNavChange={onNavChange}
        canManageServiceWorkspace
        canManageStaffApplications
      />,
    );

    for (const navigation of screen.getAllByRole("navigation", {
      name: "마이페이지 메뉴",
    })) {
      const labels = within(navigation)
        .getAllByRole("button")
        .map((button) => button.textContent);
      expect(labels.indexOf("운영진 지원 관리")).toBe(
        labels.indexOf("서비스 관리") + 1,
      );
    }
  });
});
