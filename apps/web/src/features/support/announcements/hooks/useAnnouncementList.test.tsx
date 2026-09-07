/** @jest-environment jsdom */

import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("../api/announcements.api", () => ({
  getAnnouncements: jest.fn(),
}));

import { getAnnouncements } from "../api/announcements.api";
import type { AnnouncementPost } from "../types/announcement.type";
import { useAnnouncementList } from "./useAnnouncementList";

type GetAnnouncementsMock = {
  mockReset: () => void;
  mockResolvedValue: (value: AnnouncementPost[]) => void;
  mockRejectedValue: (value: unknown) => void;
};

const mockedGetAnnouncements =
  getAnnouncements as unknown as GetAnnouncementsMock;

const announcements: AnnouncementPost[] = [
  {
    postId: 1,
    authorId: 1,
    authorName: "운영진",
    type: "ANNOUNCEMENT",
    title: "첫 공지",
    content: "오래된 내용",
    tag: "일반",
    createdAt: "2026-09-01T00:00:00.000Z",
    imageUrls: [],
  },
  {
    postId: 2,
    authorId: 1,
    authorName: "운영진",
    type: "ANNOUNCEMENT",
    title: "React 스터디 모집",
    content: "최신 공지 내용",
    tag: "스터디",
    createdAt: "2026-09-03T00:00:00.000Z",
    imageUrls: [],
  },
  {
    postId: 3,
    authorId: 1,
    authorName: "운영진",
    type: "ANNOUNCEMENT",
    title: "행사 안내",
    content: "React 발표가 있습니다.",
    tag: "행사",
    createdAt: "2026-09-02T00:00:00.000Z",
    imageUrls: [],
  },
];

describe("useAnnouncementList", () => {
  beforeEach(() => {
    mockedGetAnnouncements.mockReset();
  });

  it("sorts newest first, searches title and content, and clamps an out-of-range page", async () => {
    mockedGetAnnouncements.mockResolvedValue(announcements);
    const { result } = renderHook(() =>
      useAnnouncementList({ query: " react ", page: 3, pageSize: 1 }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.total).toBe(2);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.page).toBe(2);
    expect(result.current.items).toEqual([announcements[2]]);
    expect(result.current.errorMessage).toBeNull();
  });

  it("exposes the request error instead of presenting an empty successful list", async () => {
    mockedGetAnnouncements.mockRejectedValue(new Error("network unavailable"));
    const { result } = renderHook(() =>
      useAnnouncementList({ query: "", page: 1, pageSize: 10 }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([]);
    expect(result.current.errorMessage).toBe("network unavailable");
  });
});
