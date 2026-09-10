/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { ReactNode } from "react";
jest.mock("@ui/components/client", () => ({
  Accordion: ({
    items,
    contentClassName,
  }: {
    items: Array<{ title: ReactNode; children: ReactNode }>;
    contentClassName?: string;
  }) => (
    <div data-content-class-name={contentClassName}>
      {items.map((item, index) => (
        <section key={index}>
          <h2>{item.title}</h2>
          {item.children}
        </section>
      ))}
    </div>
  ),
}));
jest.mock("@ui/components/server", () => ({
  Badge: () => null,
  EmptyState: ({ title }: { title: string }) => <p>{title}</p>,
}));
import { FaqAccordionList } from "./FaqAccordionList";

const faq = {
  postId: 1,
  authorId: 2,
  authorName: "운영진",
  type: "FAQ" as const,
  title: "가입 방법",
  content: "지원서를 제출한 뒤 안내를 확인해주세요.",
  tag: "가입",
  createdAt: "2026-09-01T00:00:00.000Z",
};

describe("FaqAccordionList", () => {
  it("uses a text question prefix and leaves the answer unprefixed", () => {
    render(<FaqAccordionList items={[faq]} />);

    const questionTitle = screen.getByRole("heading", {
      name: "Q. 가입 방법",
    });
    expect(questionTitle).toBeTruthy();
    expect(questionTitle.firstElementChild?.className).toContain(
      "text-heading-m",
    );
    expect(screen.getByText(faq.content)).toBeTruthy();
    expect(screen.queryByText("A", { exact: true })).toBeNull();
  });
});
