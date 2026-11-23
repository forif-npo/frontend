import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { apiClient } from "@core/utils/api-client";
import {
  changeStaffRecruitmentStatus,
  deleteStaffInterviewPlan,
  getStaffApplicationDetail,
  getPublicStaffInterviewPlan,
  getStaffInterviewPlan,
  getStaffApplications,
  getStaffReviewerCandidates,
  getStaffReviewers,
  getStaffRecruitments,
  getReviewableStaffRecruitments,
  grantStaffReviewer,
  revokeStaffReviewer,
  saveStaffInterviewPlan,
  updateStaffRecruitment,
} from "./api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as ApiMock;
const mockedPost = apiClient.post as unknown as ApiMock;
const mockedPatch = apiClient.patch as unknown as ApiMock;
const mockedPut = apiClient.put as unknown as ApiMock;
const mockedDelete = apiClient.delete as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
};

function response(data: unknown) {
  return { json: <T>() => Promise.resolve({ data } as T) };
}

describe("staff recruitment admin api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedPatch.mockReset();
    mockedPut.mockReset();
    mockedDelete.mockReset();
  });

  it("requests a stable admin list page", async () => {
    mockedGet.mockReturnValue(response({ content: [] }));

    await expect(getStaffRecruitments()).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments",
      {
        searchParams: {
          page: 0,
          size: 100,
        },
      },
    );
  });

  it("loads only rounds the current admin may review", async () => {
    mockedGet.mockReturnValue(response([]));

    await expect(getReviewableStaffRecruitments()).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/reviewable",
      { cache: "no-store" },
    );
  });

  it("keeps publish as an explicit action with the optimistic version", async () => {
    mockedPost.mockReturnValue(response({ recruitment_id: 12 }));

    await changeStaffRecruitmentStatus(12, "publish", 3);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/publish",
      { json: { version: 3, reason: undefined } },
    );
  });

  it("sends the required version and replacement arrays when updating", async () => {
    mockedPatch.mockReturnValue(response({ recruitment_id: 12, version: 4 }));
    const body = {
      version: 3,
      title: "2027-1",
      summary: null,
      description: "모집 안내",
      starts_at: "2027-01-01T00:00:00+09:00",
      ends_at: "2027-01-02T00:00:00+09:00",
      departments: [
        {
          name: "기획부",
          description: null,
          display_order: 1,
          active: true,
        },
      ],
      questions: [],
    };

    await updateStaffRecruitment(12, body);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12",
      { json: body },
    );
  });

  it("uses the backend's offset pagination and department filter contract", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [],
        total_elements: 0,
        current_page: 2,
        total_pages: 0,
      }),
    );

    await getStaffApplications({
      recruitmentId: 12,
      departmentId: 31,
      search: "테스트",
      page: 2,
    });

    const [, options] = (apiClient.get as jest.Mock).mock.calls[0] as [
      string,
      { searchParams: URLSearchParams; cache: string },
    ];
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/applications",
      expect.objectContaining({ cache: "no-store" }),
    );
    expect(options.searchParams.toString()).toBe(
      "page=2&size=20&departmentId=31&search=%ED%85%8C%EC%8A%A4%ED%8A%B8",
    );
  });

  it("loads application detail without caching", async () => {
    mockedGet.mockReturnValue(response({ application_id: 9 }));

    await getStaffApplicationDetail(12, 9);

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/applications/9",
      { cache: "no-store" },
    );
  });

  it("loads reviewer candidates and grants without caching personal data", async () => {
    mockedGet.mockReturnValue(response([]));

    await getStaffReviewerCandidates(12);
    await getStaffReviewers(12);

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/staff-recruitments/12/reviewer-candidates",
      { cache: "no-store" },
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/staff-recruitments/12/reviewers",
      { cache: "no-store" },
    );
  });

  it("uses the candidate identifier and explicit expiry for grant and revoke", async () => {
    mockedPost.mockReturnValue(response({ user_id: 2099999999 }));
    mockedDelete.mockResolvedValue(undefined);
    const body = {
      user_id: 2099999999,
      expires_at: "2027-02-28T23:59:00+09:00",
    };

    await grantStaffReviewer(12, body);
    await revokeStaffReviewer(12, 2099999999);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/reviewers",
      { json: body },
    );
    expect(apiClient.delete).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/reviewers/2099999999",
    );
  });

  it("reads the interview plan of a round without caching", async () => {
    mockedGet.mockReturnValue(response({ interview_plan_id: 3, slot_minutes: 30 }));

    await expect(getStaffInterviewPlan(12)).resolves.toEqual({
      interview_plan_id: 3,
      slot_minutes: 30,
    });
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/interview-plan",
      { cache: "no-store" },
    );
  });

  it("reads the public interview plan for an application reviewer", async () => {
    mockedGet.mockReturnValue(response({ slot_minutes: 30 }));

    await expect(getPublicStaffInterviewPlan(12)).resolves.toEqual({ slot_minutes: 30 });
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/12/interview-plan",
      { cache: "no-cache" },
    );
  });

  it("treats a round without an interview plan as none instead of an error", async () => {
    mockedGet.mockReturnValue({
      json: () => Promise.reject({ response: { status: 404 } }),
    });

    await expect(getStaffInterviewPlan(12)).resolves.toBeNull();
  });

  it("does not hide other interview plan failures", async () => {
    const failure = { response: { status: 403 } };
    mockedGet.mockReturnValue({ json: () => Promise.reject(failure) });

    await expect(getStaffInterviewPlan(12)).rejects.toBe(failure);
  });

  it("saves and removes the interview plan of a round", async () => {
    mockedPut.mockReturnValue(response({ interview_plan_id: 3 }));
    mockedDelete.mockResolvedValue(undefined);
    const body = {
      dates: ["2026-12-01"],
      start_hour: 9,
      end_hour: 22,
      slot_minutes: 20,
      required: true,
      guide: "면접 가능 시간을 표시해주세요.",
    };

    await saveStaffInterviewPlan(12, body);
    await deleteStaffInterviewPlan(12);

    expect(apiClient.put).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/interview-plan",
      { json: body },
    );
    expect(apiClient.delete).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/interview-plan",
    );
  });
});
