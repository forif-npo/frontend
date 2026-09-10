/** @jest-environment jsdom */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { getCertificateTargets, getMySignature, issueCertificates, issueManualCertificate, searchMembers, uploadMySignature } from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

type PostMock = {
  mockReset: () => void;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => PostMock;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedPost = apiClient.post as unknown as PostMock;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("certificates api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
  });

  it("fails explicitly when certificate targets are absent", async () => {
    mockedGet.mockReturnValue(response(null));

    await expect(getCertificateTargets(10)).rejects.toThrow(
      "발급 대상을 불러올 수 없습니다.",
    );

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/studies/10/certificates",
    );
  });

  it("uploads a signature through the existing multipart endpoint", async () => {
    mockedPost.mockReturnValue(
      response({ signature_url: "https://cdn/sign.png" }),
    );
    const file = new File(["signature"], "signature.png", {
      type: "image/png",
    });

    await expect(uploadMySignature(file)).resolves.toBe("https://cdn/sign.png");

    const [, options] = (
      apiClient.post as unknown as {
        mock: { calls: Array<[string, { body: FormData; timeout: number }]> };
      }
    ).mock.calls[0];
    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/certificates/signature",
      { body: expect.any(FormData), timeout: 30000 },
    );
    expect((options.body.get("file") as File).name).toBe("signature.png");
  });

  it("reads the current operator signature and treats an absent value as unregistered", async () => {
    mockedGet.mockReturnValue(
      response({ signature_url: "https://cdn/sign.png" }),
    );

    await expect(getMySignature()).resolves.toBe("https://cdn/sign.png");
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/certificates/signature",
    );

    mockedGet.mockReturnValue(response(null));
    await expect(getMySignature()).resolves.toBeNull();
  });

  it("uses the existing member-search endpoint, page size, and empty fallback", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            user_id: 20260001,
            user_name: "홍길동",
            department: "컴퓨터소프트웨어학부",
            current_study_name: "React 심화",
          },
        ],
      }),
    );

    await expect(searchMembers("홍길동")).resolves.toEqual([
      expect.objectContaining({ user_id: 20260001 }),
    ]);
    expect(apiClient.get).toHaveBeenCalledWith("api/v1/admin/users", {
      searchParams: { page: 0, size: 5, search: "홍길동" },
    });

    mockedGet.mockReturnValue(response(null));
    await expect(searchMembers("없는 사용자")).resolves.toEqual([]);
  });

  it("preserves the manual and batch issuance payloads and long request timeout", async () => {
    mockedPost
      .mockReturnValueOnce(
        response({ certificate_url: "https://cdn/manual.png" }),
      )
      .mockReturnValue(
        response({
          success_count: 1,
          skipped_count: 0,
          results: [],
        }),
      );
    const manualRequest = {
      user_name: "홍길동",
      student_number: "2026000001",
      department: "컴퓨터소프트웨어학부",
      study_name: "React 심화",
      activity_period: "2026-1학기",
      issue_date: "2026-09-07",
    };

    await expect(issueManualCertificate(manualRequest)).resolves.toBe(
      "https://cdn/manual.png",
    );
    await issueCertificates(10, [20260001], "2026-1학기", true);

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/certificates/manual",
      { json: manualRequest, timeout: 60000 },
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/studies/10/certificates",
      {
        json: {
          user_ids: [20260001],
          activity_period: "2026-1학기",
          ignore_eligibility: true,
        },
        timeout: 60000,
      },
    );
  });
});
