import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
import { apiClient } from "@core/utils/api-client";
import {
  createAdminAccount,
  delegatePresidency,
  deleteAdminAccount,
  getAdminAccounts,
  updateAdminAccount,
} from "./api";

type JsonMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as JsonMock;
const mockedPost = apiClient.post as unknown as JsonMock;
const mockedPatch = apiClient.patch as unknown as JsonMock;
const mockedDelete = apiClient.delete as unknown as JsonMock;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("admin accounts api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedPatch.mockReset();
    mockedDelete.mockReset();
  });

  it("keeps administrator-list pagination and search parameters explicit", async () => {
    const page = {
      content: [
        {
          user_id: 20260001,
          name: "홍길동",
          department: "컴퓨터소프트웨어학부",
          phone_num: "010-1234-5678",
          affiliation: "회장",
        },
      ],
      total_elements: 1,
      total_pages: 1,
      current_page: 2,
    };
    mockedGet.mockReturnValue(response(page));

    await expect(
      getAdminAccounts({ page: 2, size: 50, search: "홍길동" }),
    ).resolves.toEqual(page);

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/president/admins", {
      searchParams: { page: 2, size: 50, search: "홍길동" },
    });
  });

  it("falls back to an empty page when the administrator list is absent", async () => {
    mockedGet.mockReturnValue(response(null));

    await expect(getAdminAccounts({})).resolves.toEqual({
      content: [],
      total_elements: 0,
      total_pages: 0,
      current_page: 0,
    });
  });

  it("preserves account mutations and presidency delegation payloads", async () => {
    mockedPost.mockReturnValue(response(null));
    mockedPatch.mockReturnValue(response(null));
    mockedDelete.mockReturnValue(response(null));

    await createAdminAccount({
      user_id: 20260001,
      password: "Password1!",
      affiliation: "운영진",
    });
    await updateAdminAccount(20260001, { affiliation: "회장" });
    await deleteAdminAccount(20260001);
    await delegatePresidency(20260002, "부회장");

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "api/v1/president/admins",
      {
        json: {
          user_id: 20260001,
          password: "Password1!",
          affiliation: "운영진",
        },
      },
    );
    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/president/admins/20260001",
      { json: { affiliation: "회장" } },
    );
    expect(apiClient.delete).toHaveBeenCalledWith(
      "api/v1/president/admins/20260001",
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "api/v1/president/delegate",
      { json: { user_id: 20260002, affiliation: "부회장" } },
    );
  });
});
