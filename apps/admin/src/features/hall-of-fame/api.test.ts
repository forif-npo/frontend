import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

import { apiClient } from "@core/utils/api-client";
import {
  changeHallOfFamePublication,
  createHallOfFameEntry,
  getHallOfFameEntries,
  searchHallOfFameMembers,
  updateHallOfFameEntry,
  uploadHallOfFameImage,
} from "./api";

const mockResponse = (data: unknown) => ({
  json: <T>() => Promise.resolve({ data, message: "Success" } as T),
});

describe("hall of fame admin api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads every admin status without caching", async () => {
    (apiClient.get as jest.Mock).mockReturnValue(mockResponse({ content: [] }));
    await getHallOfFameEntries();
    expect(apiClient.get).toHaveBeenCalledWith("api/v1/admin/hall-of-fame", {
      searchParams: { page: 0, size: 100 },
      cache: "no-store",
    });
  });

  it("keeps create, update and publication actions separate", async () => {
    const body = {
      member_user_id: 2099999999,
      member_name: "테스트 회원",
      slug: "test-member",
      act_year: 2026,
      act_semester: 2,
      headline: "기여자",
      introduction: "소개",
      achievements: [],
      badges: [],
      display_order: 0,
    };
    (apiClient.post as jest.Mock).mockReturnValue(
      mockResponse({ entry_id: 7 }),
    );
    (apiClient.patch as jest.Mock).mockReturnValue(
      mockResponse({ entry_id: 7 }),
    );

    await createHallOfFameEntry(body);
    await updateHallOfFameEntry(7, { ...body, version: 2 });
    await changeHallOfFamePublication(7, "publish", 3);

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/hall-of-fame",
      { json: body },
    );
    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/admin/hall-of-fame/7",
      { json: { ...body, version: 2 } },
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/hall-of-fame/7/publish",
      { json: { version: 3 } },
    );
  });

  it("keeps the new optimistic version returned by image upload", async () => {
    (apiClient.post as jest.Mock).mockReturnValue(
      mockResponse({ image_url: "/api/v1/files/image.png", version: 4 }),
    );

    const file = new File(["image"], "image.png", { type: "image/png" });
    await expect(uploadHallOfFameImage(7, file)).resolves.toEqual({
      image_url: "/api/v1/files/image.png",
      version: 4,
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/hall-of-fame/7/image",
      expect.objectContaining({ body: expect.any(FormData) }),
    );
  });

  it("maps existing member search variants at the boundary", async () => {
    (apiClient.get as jest.Mock).mockReturnValue(
      mockResponse({
        content: [
          { userId: 2099999999, userName: "테스트 회원", department: "컴퓨터" },
        ],
      }),
    );
    await expect(searchHallOfFameMembers("테스트")).resolves.toEqual([
      {
        user_id: 2099999999,
        user_name: "테스트 회원",
        department: "컴퓨터",
      },
    ]);
    expect(apiClient.get).toHaveBeenCalledWith("api/v1/admin/users", {
      searchParams: { page: 0, size: 10, search: "테스트" },
      cache: "no-store",
    });
  });
});
