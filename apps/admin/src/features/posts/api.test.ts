/** @jest-environment jsdom */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { createPost, fetchPosts, updatePost } from "./api";

type JsonMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as JsonMock;
const mockedPost = apiClient.post as unknown as JsonMock;
const mockedPatch = apiClient.patch as unknown as JsonMock;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

async function readBlob(blob: Blob) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

describe("posts api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedPatch.mockReset();
  });

  it("trims announcement search terms and maps nullable response fields", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            post_id: 1,
            author_id: null,
            author_name: null,
            type: "NOTICE",
            title: "공지",
            content: "내용",
            tag: null,
            created_at: "2026-09-07T00:00:00Z",
            image_urls: null,
          },
        ],
        total_elements: 1,
        current_page: 2,
        total_pages: 3,
      }),
    );

    await expect(
      fetchPosts({
        kind: "announcement",
        page: 2,
        size: 10,
        search: "  리액트  ",
        accessToken: "access-token",
      }),
    ).resolves.toEqual({
      content: [
        {
          postId: 1,
          authorId: null,
          authorName: "",
          type: "NOTICE",
          title: "공지",
          content: "내용",
          tag: "",
          createdAt: "2026-09-07T00:00:00Z",
          imageUrls: [],
        },
      ],
      totalElements: 1,
      currentPage: 2,
      totalPages: 3,
      pageSize: 10,
    });

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/posts/announcements", {
      searchParams: { page: "2", size: "10", search: "리액트" },
      headers: { Authorization: "Bearer access-token" },
    });
  });

  it("sends FAQ data as JSON but announcement data and images as multipart", async () => {
    mockedPost.mockReturnValue(response(null));
    const form = { title: "제목", tag: "공지", content: "내용" };
    const image = new File(["image"], "notice.png", { type: "image/png" });

    await createPost("faq", form, []);
    await createPost("announcement", form, [image]);

    expect(apiClient.post).toHaveBeenNthCalledWith(1, "api/v1/posts/faqs", {
      json: form,
    });
    const [, announcementOptions] = (
      apiClient.post as unknown as {
        mock: { calls: Array<[string, { body: FormData }]> };
      }
    ).mock.calls[1];
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "api/v1/posts/announcements",
      { body: expect.any(FormData) },
    );
    expect(
      JSON.parse(
        await readBlob(announcementOptions.body.get("request") as Blob),
      ),
    ).toEqual(form);
    expect((announcementOptions.body.get("images") as File).name).toBe(
      "notice.png",
    );
  });

  it("keeps the announcement update endpoint and multipart request contract", async () => {
    mockedPatch.mockReturnValue(response(null));
    const form = { title: "수정 제목", tag: "공지", content: "수정 내용" };

    await updatePost("announcement", 1, form, []);

    const [, options] = (
      apiClient.patch as unknown as {
        mock: { calls: Array<[string, { body: FormData }]> };
      }
    ).mock.calls[0];
    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/posts/announcements/1",
      { body: expect.any(FormData) },
    );
    expect(
      JSON.parse(await readBlob(options.body.get("request") as Blob)),
    ).toEqual(form);
  });
});
