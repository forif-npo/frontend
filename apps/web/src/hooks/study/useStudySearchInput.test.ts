/** @jest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { useStudySearchInput } from "./useStudySearchInput";

function setup(initialUrlSearch: string | undefined) {
  const onApply = jest.fn<(search: string | undefined) => void>();
  const hook = renderHook(
    ({ urlSearch }: { urlSearch: string | undefined }) =>
      useStudySearchInput({ urlSearch, onApply }),
    { initialProps: { urlSearch: initialUrlSearch } },
  );
  return { ...hook, onApply };
}

describe("useStudySearchInput", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes the input from the URL without writing the URL back", () => {
    const { result, onApply } = setup("파이썬");

    expect(result.current.searchInput).toBe("파이썬");
    act(() => jest.advanceTimersByTime(1000));
    expect(onApply).not.toHaveBeenCalled();
  });

  it("applies the typed search after the debounce delay", () => {
    const { result, onApply } = setup(undefined);

    act(() => result.current.setSearchInput("파이썬"));
    act(() => jest.advanceTimersByTime(499));
    expect(onApply).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith("파이썬");
  });

  it("clears the input when the URL search is removed and does not restore it", () => {
    const { result, rerender, onApply } = setup("파이썬");

    rerender({ urlSearch: undefined });
    expect(result.current.searchInput).toBe("");

    act(() => jest.advanceTimersByTime(1000));
    expect(onApply).not.toHaveBeenCalled();
  });

  it("follows a URL search restored by history navigation without overwriting it", () => {
    const { result, rerender, onApply } = setup(undefined);

    rerender({ urlSearch: "파이썬" });
    expect(result.current.searchInput).toBe("파이썬");

    act(() => jest.advanceTimersByTime(1000));
    expect(onApply).not.toHaveBeenCalled();
  });

  it("keeps text typed after an applied search comes back through the URL", () => {
    const { result, rerender, onApply } = setup(undefined);

    act(() => result.current.setSearchInput("파이"));
    act(() => jest.advanceTimersByTime(500));
    expect(onApply).toHaveBeenLastCalledWith("파이");

    act(() => result.current.setSearchInput("파이썬"));
    rerender({ urlSearch: "파이" });
    expect(result.current.searchInput).toBe("파이썬");
  });

  it("applies immediately on submit and skips the duplicate debounced apply", () => {
    const { result, onApply } = setup(undefined);

    act(() => result.current.setSearchInput("파이썬"));
    act(() => result.current.submitSearch());
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith("파이썬");

    act(() => jest.advanceTimersByTime(1000));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("applies undefined when the search is cleared", () => {
    const { result, onApply } = setup("파이썬");

    act(() => result.current.setSearchInput(""));
    act(() => jest.advanceTimersByTime(500));
    expect(onApply).toHaveBeenCalledWith(undefined);
  });
});
