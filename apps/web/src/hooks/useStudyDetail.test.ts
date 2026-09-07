/** @jest-environment jsdom */

import { act, renderHook, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import type { Study } from "@/types/study";
import { useStudyDetail } from "./useStudyDetail";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => GetMock;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => GetMock;
};

const mockedGet = apiClient.get as unknown as GetMock;

const study = {
  id: 42,
  study_name: "React 심화",
} as unknown as Study;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

describe("useStudyDetail", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the existing study detail response for the requested id", async () => {
    mockedGet.mockReturnValue(response(study));

    const { result } = renderHook(() => useStudyDetail("42"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/studies/42");
    expect(result.current.study).toEqual(study);
    expect(result.current.error).toBeNull();
  });

  it("exposes an error instead of a detail when the response has no data", async () => {
    mockedGet.mockReturnValue(response(null));
    const errorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const { result } = renderHook(() => useStudyDetail("42"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.study).toBeNull();
    expect(result.current.error?.message).toBe(
      "스터디 정보를 불러올 수 없습니다.",
    );
    expect(errorSpy).toHaveBeenCalled();
  });

  it("fetches the newly selected study id when the caller changes it", async () => {
    mockedGet
      .mockReturnValueOnce(response(study))
      .mockReturnValue(
        response({ ...study, id: 43, study_name: "Next.js 심화" }),
      );

    const { result, rerender } = renderHook(
      ({ studyId }: { studyId: string }) => useStudyDetail(studyId),
      { initialProps: { studyId: "42" } },
    );
    await waitFor(() => expect(result.current.study).toEqual(study));

    rerender({ studyId: "43" });

    await waitFor(() => expect(result.current.study?.id).toBe(43));
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "api/v1/studies/43");
  });

  it("does not let a slower previous request overwrite the newly selected study", async () => {
    const first = deferred<{ data: Study }>();
    const second = deferred<{ data: Study }>();
    mockedGet
      .mockReturnValueOnce({ json: <T>() => first.promise as Promise<T> })
      .mockReturnValue({ json: <T>() => second.promise as Promise<T> });

    const { result, rerender } = renderHook(
      ({ studyId }: { studyId: string }) => useStudyDetail(studyId),
      { initialProps: { studyId: "42" } },
    );
    await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(1));

    rerender({ studyId: "43" });
    await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(2));

    second.resolve({ data: { ...study, id: 43, study_name: "Next.js 심화" } });
    await waitFor(() => expect(result.current.study?.id).toBe(43));

    await act(async () => {
      first.resolve({ data: study });
      await Promise.resolve();
    });

    expect(result.current.study?.id).toBe(43);
  });
});
