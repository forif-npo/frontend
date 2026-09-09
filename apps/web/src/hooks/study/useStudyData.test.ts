/** @jest-environment jsdom */
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import type { Study } from "@core/types/study";
import { useStudyData } from "./useStudyData";

type GetMock = {
  mockReset: () => void;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => GetMock;
};

const mockedGet = apiClient.get as unknown as GetMock;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

const firstStudy = { id: 1, study_name: "이전 검색 결과" } as Study;
const latestStudy = { id: 2, study_name: "최신 검색 결과" } as Study;

describe("useStudyData", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("keeps the latest filter result when an earlier request resolves later", async () => {
    const first = deferred<unknown>();
    const latest = deferred<unknown>();
    mockedGet
      .mockReturnValueOnce({ json: <T>() => first.promise as Promise<T> })
      .mockReturnValueOnce({ json: <T>() => latest.promise as Promise<T> });

    const { result } = renderHook(() => useStudyData());

    act(() => {
      void result.current.refetch({ search: "previous" });
      void result.current.refetch({ search: "latest" });
    });

    await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(2));

    latest.resolve({
      data: { content: [latestStudy], total_elements: 1 },
    });
    await waitFor(() => expect(result.current.studies).toEqual([latestStudy]));

    await act(async () => {
      first.resolve({
        data: { content: [firstStudy], total_elements: 1 },
      });
      await Promise.resolve();
    });

    expect(result.current.studies).toEqual([latestStudy]);
  });
});
