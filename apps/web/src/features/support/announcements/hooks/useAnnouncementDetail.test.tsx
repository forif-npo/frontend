/** @jest-environment jsdom */
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("../api/announcements.api", () => ({
  getAnnouncementById: jest.fn(),
}));
import { getAnnouncementById } from "../api/announcements.api";
import type { AnnouncementPost } from "../types/announcement.type";
import { useAnnouncementDetail } from "./useAnnouncementDetail";

type GetAnnouncementMock = {
  mockReset: () => void;
  mockResolvedValue: (value: AnnouncementPost | null) => void;
  mockRejectedValue: (value: unknown) => void;
  mockReturnValueOnce: (value: Promise<AnnouncementPost | null>) => void;
  mockReturnValue: (value: Promise<AnnouncementPost | null>) => void;
};

const mockedGetAnnouncement =
  getAnnouncementById as unknown as GetAnnouncementMock;

const first: AnnouncementPost = {
  postId: 1,
  authorId: 1,
  authorName: "운영진",
  type: "ANNOUNCEMENT",
  title: "첫 공지",
  content: "내용",
  tag: "일반",
  createdAt: "2026-09-01T00:00:00.000Z",
  imageUrls: [],
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

describe("useAnnouncementDetail", () => {
  beforeEach(() => {
    mockedGetAnnouncement.mockReset();
  });

  it("keeps an absent announcement distinct from a request error", async () => {
    mockedGetAnnouncement.mockResolvedValue(null);
    const { result } = renderHook(() => useAnnouncementDetail(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.item).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });

  it("exposes a failed request message", async () => {
    mockedGetAnnouncement.mockRejectedValue(new Error("network unavailable"));
    const { result } = renderHook(() => useAnnouncementDetail(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.errorMessage).toBe("network unavailable");
  });

  it("ignores a previous detail response after the route id changes", async () => {
    const previous = deferred<AnnouncementPost | null>();
    const latest = deferred<AnnouncementPost | null>();
    const second = { ...first, postId: 2, title: "두 번째 공지" };
    mockedGetAnnouncement.mockReturnValueOnce(previous.promise);
    mockedGetAnnouncement.mockReturnValue(latest.promise);

    const { result, rerender } = renderHook(
      ({ id }: { id: number }) => useAnnouncementDetail(id),
      { initialProps: { id: 1 } },
    );
    await waitFor(() => expect(getAnnouncementById).toHaveBeenCalledTimes(1));

    rerender({ id: 2 });
    await waitFor(() => expect(getAnnouncementById).toHaveBeenCalledTimes(2));

    latest.resolve(second);
    await waitFor(() => expect(result.current.item).toEqual(second));

    await act(async () => {
      previous.resolve(first);
      await Promise.resolve();
    });

    expect(result.current.item).toEqual(second);
  });
});
