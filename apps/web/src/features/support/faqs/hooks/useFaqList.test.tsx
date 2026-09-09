/** @jest-environment jsdom */
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("../api/faqs.api", () => ({
  getFaqs: jest.fn(),
}));
import { getFaqs } from "../api/faqs.api";
import type { FaqPost } from "../types/faq.type";
import { useFaqList } from "./useFaqList";

type GetFaqsMock = {
  mockReset: () => void;
  mockResolvedValue: (value: FaqPost[]) => void;
  mockRejectedValue: (value: unknown) => void;
};

const mockedGetFaqs = getFaqs as unknown as GetFaqsMock;

const faqs: FaqPost[] = [
  {
    postId: 1,
    authorId: 1,
    authorName: "운영진",
    type: "FAQ",
    title: "가입 방법",
    content: "지원서 제출 후 안내를 확인해주세요.",
    tag: " 가입 ",
    createdAt: "2026-09-01T00:00:00.000Z",
  },
  {
    postId: 2,
    authorId: 1,
    authorName: "운영진",
    type: "FAQ",
    title: "스터디 운영",
    content: "스터디는 매주 진행됩니다.",
    tag: "스터디",
    createdAt: "2026-09-03T00:00:00.000Z",
  },
  {
    postId: 3,
    authorId: 1,
    authorName: "운영진",
    type: "FAQ",
    title: "행사 질문",
    content: "가입한 부원도 참여할 수 있습니다.",
    tag: "행사",
    createdAt: "2026-09-02T00:00:00.000Z",
  },
];

describe("useFaqList", () => {
  beforeEach(() => {
    mockedGetFaqs.mockReset();
  });

  it("builds trimmed categories and applies search before the selected category", async () => {
    mockedGetFaqs.mockResolvedValue(faqs);
    const { result } = renderHook(() =>
      useFaqList({ query: "가입", category: "가입", page: 1, pageSize: 10 }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toEqual(["가입", "스터디", "행사"]);
    expect(result.current.total).toBe(1);
    expect(result.current.items).toEqual([faqs[0]]);
  });

  it("shows the stable FAQ error message when the list request fails", async () => {
    const errorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockedGetFaqs.mockRejectedValue(new Error("network unavailable"));
    const { result } = renderHook(() =>
      useFaqList({ query: "", category: "", page: 1, pageSize: 10 }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([]);
    expect(result.current.errorMessage).toBe("FAQ를 불러오지 못했습니다.");
    expect(errorSpy).toHaveBeenCalled();
  });
});
