import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), patch: jest.fn(), post: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { fetchCriteria, submitTeamEvaluation, updateHackathonStatus } from "./api";

type JsonMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as JsonMock;
const mockedPatch = apiClient.patch as unknown as JsonMock;
const mockedPost = apiClient.post as unknown as JsonMock;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("hackathon api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPatch.mockReset();
    mockedPost.mockReset();
  });

  it("sorts criteria by display order after requesting the authenticated list", async () => {
    const criteria = [
      {
        criterion_id: 2,
        hackathon_id: 10,
        name: "완성도",
        max_score: 50,
        weight: 1,
        display_order: 2,
      },
      {
        criterion_id: 1,
        hackathon_id: 10,
        name: "창의성",
        max_score: 50,
        weight: 1,
        display_order: 1,
      },
    ];
    mockedGet.mockReturnValue(response({ content: criteria }));

    await expect(fetchCriteria(10, "access-token")).resolves.toEqual([
      criteria[1],
      criteria[0],
    ]);

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/hackathons/10/criteria",
      {
        searchParams: { page: "0", size: "100" },
        headers: { Authorization: "Bearer access-token" },
      },
    );
  });

  it("preserves status changes and team-evaluation score payloads", async () => {
    mockedPatch.mockReturnValue(response(null));
    mockedPost.mockReturnValue(response(null));
    const scores = [{ criterion_id: 1, score: 42 }];

    await updateHackathonStatus(10, "JUDGING");
    await submitTeamEvaluation(10, 20, scores);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/admin/hackathons/10/status",
      { json: { status: "JUDGING" } },
    );
    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/hackathons/10/teams/20/evaluations",
      { json: { scores } },
    );
  });
});
