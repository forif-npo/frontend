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
import { cancelStaffApplication, getCurrentStaffRecruitment, getMyStaffApplication, getMyStaffApplications, submitStaffApplication, updateStaffApplication } from "./api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as ApiMock;
const mockedPost = apiClient.post as unknown as ApiMock;
const mockedPatch = apiClient.patch as unknown as ApiMock;
const mockedDelete = apiClient.delete as jest.Mock;

describe("staff recruitment public api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedPatch.mockReset();
    mockedDelete.mockReset();
  });

  it("uses the public current endpoint without stale cache", async () => {
    mockedGet.mockReturnValue({
      json: <T>() => Promise.resolve({ data: null } as T),
    });

    await expect(getCurrentStaffRecruitment()).resolves.toBeNull();
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/current",
      { cache: "no-cache" },
    );
  });

  it("submits only department choices and question answers", async () => {
    const body = {
      department_choices: [{ department_id: 31, priority: 1 as const }],
      answers: [{ question_id: 41, answer: "테스트 지원 동기" }],
    };
    mockedPost.mockReturnValue({
      json: <T>() =>
        Promise.resolve({
          data: { application_id: 7, recruitment_id: 3 },
        } as T),
    });

    await submitStaffApplication(3, body);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/3/applications",
      { json: body },
    );
  });

  it("sends file answers as named multipart parts", async () => {
    const file = new File(["portfolio"], "portfolio.pdf", {
      type: "application/pdf",
    });
    mockedPost.mockReturnValue({
      json: <T>() => Promise.resolve({ data: { application_id: 7 } } as T),
    });

    await submitStaffApplication(
      3,
      {
        department_choices: [{ department_id: 31, priority: 1 }],
        answers: [{ question_id: 41, answer: "" }],
      },
      { 41: file },
    );

    const [, options] = (apiClient.post as jest.Mock).mock.calls[0] as [
      string,
      { body: FormData },
    ];
    expect(options.body.get("file_41")).toBe(file);
    expect(options.body.get("request")).toBeInstanceOf(Blob);
  });

  it("loads only the authenticated user's application without caching", async () => {
    mockedGet.mockReturnValue({
      json: <T>() => Promise.resolve({ data: { application_id: 7 } } as T),
    });

    await getMyStaffApplication(3);

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/3/applications/me",
      { cache: "no-store" },
    );
  });

  it("updates answers as JSON when no file is selected", async () => {
    const body = {
      department_choices: [{ department_id: 31, priority: 1 as const }],
      answers: [{ question_id: 41, answer: "수정한 답변" }],
      removed_file_question_ids: [42],
    };
    mockedPatch.mockReturnValue({
      json: <T>() => Promise.resolve({ data: { application_id: 7 } } as T),
    });

    await updateStaffApplication(3, body, {});

    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/3/applications/me",
      { json: body },
    );
  });

  it("updates a replacement attachment using its question ID", async () => {
    const file = new File(["portfolio"], "new.pdf", {
      type: "application/pdf",
    });
    mockedPatch.mockReturnValue({
      json: <T>() => Promise.resolve({ data: { application_id: 7 } } as T),
    });

    await updateStaffApplication(
      3,
      {
        department_choices: [{ department_id: 31, priority: 1 }],
        answers: [{ question_id: 42, answer: "" }],
        removed_file_question_ids: [],
      },
      { 42: file },
    );

    const [, options] = (apiClient.patch as jest.Mock).mock.calls[0] as [
      string,
      { body: FormData },
    ];
    expect(options.body.get("file_42")).toBe(file);
    expect(options.body.get("request")).toBeInstanceOf(Blob);
  });

  it("cancels the authenticated user's application", async () => {
    await cancelStaffApplication(3);

    expect(apiClient.delete).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/3/applications/me",
    );
  });

  it("loads all of the signed-in user's application history without caching", async () => {
    const history = [{ application_id: 7, recruitment_id: 3 }];
    mockedGet.mockReturnValue({
      json: <T>() => Promise.resolve({ data: history } as T),
    });

    await expect(getMyStaffApplications("test-token")).resolves.toEqual(
      history,
    );
    expect(apiClient.get).toHaveBeenCalledWith("api/v1/staff-applications/me", {
      cache: "no-store",
      headers: { Authorization: "Bearer test-token" },
    });
  });
});
