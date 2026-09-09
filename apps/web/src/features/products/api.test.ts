/** @jest-environment jsdom */
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
  applyProduct,
  deleteProductApplication,
  getMyProductApplications,
  updateProductApplication,
} from "./api";

type JsonMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as JsonMock;
const mockedPost = apiClient.post as unknown as JsonMock;
const mockedPatch = apiClient.patch as unknown as JsonMock;
const mockedDelete = apiClient.delete as unknown as JsonMock;

const product = {
  application_id: 12,
  name: "FORIF 서비스",
  slug: "forif-service",
  one_liner: "동아리 서비스",
  description: "서비스 설명",
  source_type: "STUDY" as const,
  service_url: null,
  github_url: "https://github.com/forif/service",
  thumbnail_url: null,
  tags: ["React"],
  tech_stack: ["TypeScript"],
  status: "PENDING" as const,
  operation_status: null,
  reject_reason: null,
  applied_at: "2026-09-07T00:00:00Z",
};

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

describe("products api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedPatch.mockReset();
    mockedDelete.mockReset();
  });

  it("submits an application through the existing multipart contract", async () => {
    mockedPost.mockReturnValue(response(product));
    const thumbnail = new File(["image"], "thumbnail.png", {
      type: "image/png",
    });
    const request = {
      name: product.name,
      slug: product.slug,
      one_liner: product.one_liner,
      description: product.description,
      source_type: product.source_type,
      github_url: product.github_url,
      tags: product.tags,
    };

    await expect(applyProduct(request, thumbnail)).resolves.toEqual(product);

    const [, options] = (
      apiClient.post as unknown as {
        mock: { calls: Array<[string, { body: FormData }]> };
      }
    ).mock.calls[0];
    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/products/applications",
      {
        body: expect.any(FormData),
      },
    );
    expect(
      JSON.parse(await readBlob(options.body.get("request") as Blob)),
    ).toEqual(request);
    expect((options.body.get("thumbnail") as File).name).toBe("thumbnail.png");
  });

  it("keeps the authenticated application-list request unchanged", async () => {
    mockedGet.mockReturnValue(response([product]));

    await expect(getMyProductApplications("access-token")).resolves.toEqual([
      product,
    ]);

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/products/applications/me",
      { headers: { Authorization: "Bearer access-token" } },
    );
  });

  it("uses the existing update and delete endpoints for a pending application", async () => {
    mockedPatch.mockReturnValue(response(product));
    mockedDelete.mockReturnValue(response(null));
    const request = {
      name: product.name,
      slug: product.slug,
      one_liner: product.one_liner,
      description: product.description,
      source_type: product.source_type,
      remove_thumbnail: true,
    };

    await expect(updateProductApplication(12, request)).resolves.toEqual(
      product,
    );
    await deleteProductApplication(12);

    const [, updateOptions] = (
      apiClient.patch as unknown as {
        mock: { calls: Array<[string, { body: FormData }]> };
      }
    ).mock.calls[0];
    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/products/applications/12",
      { body: expect.any(FormData) },
    );
    expect(
      JSON.parse(await readBlob(updateOptions.body.get("request") as Blob)),
    ).toEqual(request);
    expect(apiClient.delete).toHaveBeenCalledWith(
      "api/v1/products/applications/12",
    );
  });
});
