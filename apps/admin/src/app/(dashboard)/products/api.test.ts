import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    delete: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
  },
}));
import { apiClient } from "@core/utils/api-client";
import { approveProduct, changeProductOperationStatus, deleteProduct, deleteProductThumbnail, getAdminProducts, rejectProduct, updateProduct, uploadProductThumbnail } from "./api";

type RequestMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as RequestMock;
const mockedPatch = apiClient.patch as unknown as RequestMock;
const mockedDelete = apiClient.delete as unknown as RequestMock;
const mockedPost = apiClient.post as unknown as RequestMock;

function response(data: unknown) {
  return { json: <T>() => Promise.resolve({ data } as T) };
}

describe("admin products api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPatch.mockReset();
    mockedDelete.mockReset();
    mockedPost.mockReset();
  });

  it("returns an empty list when the product response has no data", async () => {
    mockedGet.mockReturnValue(response(null));

    await expect(getAdminProducts()).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenCalledWith("api/v1/admin/products");
  });

  it("preserves approval, rejection, and operation-status request contracts", async () => {
    mockedPatch.mockReturnValue(response(null));

    await approveProduct(3);
    await rejectProduct(3, "정책 미충족");
    await changeProductOperationStatus(3, "PAUSED");

    expect(apiClient.patch).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/products/3/approve",
    );
    expect(apiClient.patch).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/products/3/reject",
      { json: { reject_reason: "정책 미충족" } },
    );
    expect(apiClient.patch).toHaveBeenNthCalledWith(
      3,
      "api/v1/admin/products/3/operation-status",
      { json: { operation_status: "PAUSED" } },
    );
  });

  it("keeps intentionally empty update values and thumbnail deletion endpoints", async () => {
    mockedPatch.mockReturnValue(
      response({ product_id: 3, name: "Updated product" }),
    );
    mockedDelete.mockReturnValue(response(null));

    await expect(
      updateProduct(3, { name: "", tags: [], tech_stack: [] }),
    ).resolves.toMatchObject({ product_id: 3, name: "Updated product" });
    await deleteProduct(3);
    await deleteProductThumbnail(3);

    expect(apiClient.patch).toHaveBeenCalledWith("api/v1/admin/products/3", {
      json: { name: "", tags: [], tech_stack: [] },
    });
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/products/3",
    );
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/products/3/thumbnail",
    );
  });

  it("uploads a thumbnail as FormData and returns the optional URL", async () => {
    mockedPost.mockReturnValue(
      response({ thumbnail_url: "https://cdn.forif.org/thumbnail.png" }),
    );

    const file = new Blob(["image"], { type: "image/png" }) as File;

    await expect(uploadProductThumbnail(3, file)).resolves.toBe(
      "https://cdn.forif.org/thumbnail.png",
    );
    const [, options] = (
      apiClient.post as unknown as {
        mock: { calls: Array<[string, { body: FormData }]> };
      }
    ).mock.calls[0];
    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/products/3/thumbnail",
      expect.objectContaining({ body: expect.any(FormData) }),
    );
    expect(options.body.get("file")).toEqual(
      expect.objectContaining({ size: 5, type: "image/png" }),
    );
  });
});
