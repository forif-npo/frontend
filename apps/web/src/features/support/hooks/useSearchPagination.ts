"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

type UseSearchPaginationOptions = {
  defaultQuery?: string;
  defaultPage?: number;
};

export const useSearchPagination = (options?: UseSearchPaginationOptions) => {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(options?.defaultQuery ?? ""),
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(options?.defaultPage ?? 1),
  );

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return {
    query,
    page,
    setPage,
    setQuery: updateQuery,
  };
};
