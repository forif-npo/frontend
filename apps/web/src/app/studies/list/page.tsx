"use client";

import { StudySearchBar } from "@/components/study";
import { StudyListSkeleton } from "@/components/study/skeleton/StudyCardSkeleton";
import { StudyActionButtons } from "@/components/study/ui/StudyActionButtons";
import { StudyCardGrid } from "@/components/study/ui/StudyCardGrid";
import { StudyFilterSection } from "@/components/study/ui/StudyFilterSection";
import { StudyListMobileHeader } from "@/components/study/ui/StudyListMobileHeader";
import { StudyResultsHeader } from "@/components/study/ui/StudyResultsHeader";
import { usePagination, useStudyData, useStudyFilters } from "@/hooks/study";
import { useDebounce } from "@/hooks/useDebounce";
import { Study, StudyListParams } from "@/types/study";
import { Pagination } from "@ui/components/client";
import { Heading } from "@ui/components/server";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function StudyListPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedSearch = useDebounce(searchInput, 500);

  const { filters, updateFilter, updateMultipleFilters, clearAllFilters } =
    useStudyFilters();

  const { currentPage, pageSize, setPage, setPageSize } = usePagination({
    data: [],
    initialPageSize: 20,
  });

  useEffect(() => {
    updateFilter("search", debouncedSearch || undefined);
  }, [debouncedSearch, updateFilter]);

  const apiParams: StudyListParams = useMemo(() => {
    return {
      page: currentPage - 1,
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

  const { studies, loading, error, refetch } = useStudyData(apiParams);
  console.log("studies:", studies);

  useEffect(() => {
    refetch(apiParams);
  }, [apiParams, refetch]);

  const handleCardClick = (study: Study) => {
    router.push(`/studies/detail/${study.id}`);
  };

  const handleApplyClick = (study: Study) => {
    router.push(`/studies/detail/${study.id}/apply`);
  };

  if (error) {
    return (
      <div className="bg-bg-base flex min-h-screen items-center justify-center">
        <div className="text-status-error text-lg">
          오류가 발생했습니다: {error}
        </div>
      </div>
    );
  }

  const selectedSemester =
    filters.year && filters.semester
      ? `${filters.year}-${filters.semester}`
      : "";

  const handleSemesterChange = (value: string) => {
    if (value) {
      const [year, semester] = value.split("-").map(Number);
      updateMultipleFilters({ year, semester });
    } else {
      updateMultipleFilters({ year: undefined, semester: undefined });
    }
  };

  return (
    <div className="bg-bg-base min-h-screen pb-20">
      <div className="w-full pb-8">
        <Heading size="l" className="mb-6 md:mb-12">
          스터디 목록
        </Heading>

        <StudyListMobileHeader
          searchInput={searchInput}
          onSearchChange={(value) => setSearchInput(value)}
          onSearchSubmit={() => {
            updateFilter("search", searchInput || undefined);
            setPage(0);
          }}
          selectedSemester={selectedSemester}
          selectedDifficulty={filters.difficulty || ""}
          selectedTag={filters.tag || ""}
          onSemesterChange={handleSemesterChange}
          onDifficultyChange={(value) => updateFilter("difficulty", value)}
          onTagChange={(value) => updateFilter("tag", value || undefined)}
          onClearAllFilters={clearAllFilters}
          totalItems={studies.length}
          loading={loading}
        />

        <div className="hidden md:block">
          <div className="mb-6 flex items-center justify-between gap-7">
            <StudySearchBar
              value={searchInput}
              onChange={(value) => setSearchInput(value)}
              onSubmit={() => {
                updateFilter("search", searchInput || undefined);
                setPage(0);
              }}
            />
            <StudyActionButtons />
          </div>

          <div className="mb-7">
            <StudyFilterSection
              selectedSemester={selectedSemester}
              selectedDifficulty={filters.difficulty || ""}
              selectedTag={filters.tag || ""}
              onSemesterChange={handleSemesterChange}
              onDifficultyChange={(value) => updateFilter("difficulty", value)}
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
        </div>

        {loading ? (
          <StudyListSkeleton />
        ) : (
          <>
            <div className="mb-10">
              <StudyCardGrid
                studies={studies}
                onCardClick={handleCardClick}
                onApplyClick={handleApplyClick}
              />
            </div>

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
