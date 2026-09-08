/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img">) => <img {...props} />,
}));

import { AlimTalkPreview } from "./alimtalk-preview";

describe("AlimTalkPreview", () => {
  it("renders a resolved template link as a usable preview button", () => {
    render(
      <AlimTalkPreview
        template={{
          templateId: "template-1",
          name: "구글폼 안내",
          content: "구글폼을 제출해주세요.",
          status: "APPROVED",
          messageType: "BA",
          dateCreated: null,
          dateUpdated: null,
          variables: ["#{url}"],
          buttonLinks: [
            "https://forms.google.com/#{url}",
            "https://example.com/unused",
          ],
        }}
        variables={{ "#{url}": "example" }}
      />,
    );

    const link = screen.getByRole("link", { name: "링크 바로가기" });
    expect(link.getAttribute("href")).toBe("https://forms.google.com/example");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("keeps a template button disabled until its link variable is valid", () => {
    render(
      <AlimTalkPreview
        template={{
          templateId: "template-1",
          name: "구글폼 안내",
          content: "구글폼을 제출해주세요.",
          status: "APPROVED",
          messageType: "BA",
          dateCreated: null,
          dateUpdated: null,
          variables: ["#{url}"],
          buttonLinks: ["https://forms.google.com/#{url}"],
        }}
        variables={{ "#{url}": "" }}
      />,
    );

    expect(screen.queryByRole("link", { name: "링크 바로가기" })).toBeNull();
    expect(
      screen.getByText("링크 바로가기").getAttribute("aria-disabled"),
    ).toBe("true");
  });
});
