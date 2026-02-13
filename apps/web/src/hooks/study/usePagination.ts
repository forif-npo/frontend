import { useState, useMemo, useCallback } from "react";

interface UsePaginationProps<T> {
  data: T[];
  initialPageSize?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  currentData: T[];
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function usePagination<T>({
  data,
  initialPageSize = 12,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const setPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages],
  );

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const prevPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    currentData,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrev,
  };
}
