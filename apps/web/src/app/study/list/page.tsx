"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useStudyData, useStudyFilters, usePagination } from "@/hooks/study";
import { useRouter } from "next/navigation";
import { StudyListParams, Study } from "@/types/study";
import { StudyCardGrid } from "@/components/study/ui/StudyCardGrid";
import { StudySearchBar } from "@/components/study/ui/StudySearchBar";
import { StudyFilterSection } from "@/components/study/ui/StudyFilterSection";
import { StudyActionButtons } from "@/components/study/ui/StudyActionButtons";
import { StudyResultsHeader } from "@/components/study/ui/StudyResultsHeader";
import { Pagination } from "@ui/components/client";
import { StudyListSkeleton } from "@/components/study/skeleton/StudyCardSkeleton";
import { Heading } from "@ui/components/server";
import { useDebounce } from "@/hooks/useDebounce";

export default function StudyListPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [searchInput, setSearchInput] = useState<string>("");

  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(searchInput, 500);

  // Filters from URL
  const { filters, updateFilter, updateMultipleFilters, clearAllFilters } =
    useStudyFilters();

  // Pagination state
  const { currentPage, pageSize, setPage, setPageSize } = usePagination({
    data: [],
    initialPageSize: 20,
  });

  // Update filter when debounced search changes
  useEffect(() => {
    updateFilter("search", debouncedSearch || undefined);
  }, [debouncedSearch, updateFilter]);

  // Build API params from filters and pagination
  const apiParams: StudyListParams = useMemo(() => {
    return {
      page: currentPage,
      page_size: pageSize,
      year: filters.year,
      semester: filters.semester,
      difficulties: filters.difficulty ? [filters.difficulty] : undefined,
      tags: filters.tag ? [filters.tag] : undefined,
      recruit_status: filters.recruitStatus,
      search: filters.search,
    };
  }, [
    currentPage,
    pageSize,
    filters.year,
    filters.semester,
    filters.difficulty,
    filters.tag,
    filters.recruitStatus,
    filters.search,
  ]);

  // Fetch studies with current params
  const { studies, loading, error, refetch } = useStudyData(apiParams);

  // Refetch when filters or pagination change
  useEffect(() => {
    refetch(apiParams);
  }, [apiParams, refetch]);

  const handleCardClick = (study: Study) => {
    router.push(`/study/detail/${study.id}`);
  };

  const handleApplyClick = (study: Study) => {
    // TODO: 신청 로직 구현
    console.log("Apply for study:", study.id);
  };

  // Error state
  if (error) {
    return (
      <div className="bg-bg-base flex min-h-screen items-center justify-center">
        <div className="text-status-error text-lg">
          오류가 발생했습니다: {error}
        </div>
      </div>
    );
  }

  // Build combined semester value for StudyFilterSection
  const selectedSemester =
    filters.year && filters.semester
      ? `${filters.year}-${filters.semester}`
      : "";

  return (
    <div className="bg-bg-base min-h-screen pb-20">
      <div className="w-full pb-8">
        <Heading size="l" className="mb-12">
          스터디 목록
        </Heading>

        {/* Search + Action Buttons */}
        <div className="mb-6 flex items-center justify-between gap-7">
          <StudySearchBar
            value={searchInput}
            onChange={(value) => setSearchInput(value)}
            onSubmit={() => {
              // Trigger immediate search on Enter/Submit
              updateFilter("search", searchInput || undefined);
              setPage(0);
            }}
          />
          <StudyActionButtons />
        </div>

        {/* Filters */}
        <div className="mb-7">
          <StudyFilterSection
            selectedSemester={selectedSemester}
            selectedDifficulty={filters.difficulty || ""}
            selectedTag={filters.tag || ""}
            onSemesterChange={(value) => {
              if (value) {
                const [year, semester] = value.split("-").map(Number);
                updateMultipleFilters({ year, semester });
              } else {
                updateMultipleFilters({ year: undefined, semester: undefined });
              }
            }}
            onDifficultyChange={(value) =>
              updateFilter("difficulty", (value || undefined) as any)
            }
            onTagChange={(value) => updateFilter("tag", value || undefined)}
            onClearAll={clearAllFilters}
          />
        </div>
        <div className="mb-6">
          <StudyResultsHeader
            totalItems={studies.length}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
        {loading ? (
          <StudyListSkeleton />
        ) : (
          <>
            {/* Study Cards Grid */}
            <div className="mb-10">
              <StudyCardGrid
                studies={studies}
                onCardClick={handleCardClick}
                onApplyClick={handleApplyClick}
              />
            </div>

            {/* Pagination */}
            {studies.length > 0 && (
              <Pagination
                currentPage={currentPage + 1}
                totalPages={Math.ceil(studies.length / pageSize) || 1}
                onPageChange={(page) => setPage(page - 1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
