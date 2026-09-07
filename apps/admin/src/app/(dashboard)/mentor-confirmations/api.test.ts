import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  getMentorConfirmationTargets,
  getMentorConfirmationViewUrl,
  issueMentorConfirmations,
} from "./api";

type RequestMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as RequestMock;
const mockedPost = apiClient.post as unknown as RequestMock;

function response(data: unknown) {
  return { json: <T>() => Promise.resolve({ data } as T) };
}

describe("mentor confirmations api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
  });

  it("preserves the target and issued-confirmation lookup endpoints", async () => {
    mockedGet.mockReturnValueOnce(
      response({
        study_id: 1,
        study_name: "React 스터디",
        act_year: 2026,
        act_semester: 1,
        targets: [],
      }),
    );
    mockedGet.mockReturnValueOnce(
      response({ issued: true, confirmation_url: "https://example.com/file" }),
    );

    await getMentorConfirmationTargets(1);
    await getMentorConfirmationViewUrl(1, 20260001);

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/studies/1/mentor-confirmations",
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/studies/1/mentor-confirmations/20260001",
    );
  });

  it("preserves the snake_case issuance payload and timeout", async () => {
    mockedPost.mockReturnValue(
      response({
        success_count: 2,
        skipped_count: 0,
        results: [],
      }),
    );

    await issueMentorConfirmations(
      1,
      [20260001, 20260002],
      "2026.01.01.~2026.06.30.",
    );

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/studies/1/mentor-confirmations",
      {
        json: {
          user_ids: [20260001, 20260002],
          activity_period: "2026.01.01.~2026.06.30.",
        },
        timeout: 60000,
      },
    );
  });

  it("fails when the issued confirmation URL is absent", async () => {
    mockedGet.mockReturnValue(
      response({ issued: true, confirmation_url: null }),
    );

    await expect(getMentorConfirmationViewUrl(1, 20260001)).rejects.toThrow(
      "발급된 확인서를 찾을 수 없습니다.",
    );
  });
});
