"use client";

import { StudySearchBar } from "@/components/study";
import { StudyListSkeleton } from "@/components/study/skeleton/StudyCardSkeleton";
import { StudyActionButtons } from "@/components/study/ui/StudyActionButtons";
import { StudyCardGrid } from "@/components/study/ui/StudyCardGrid";
import { StudyFilterSection } from "@/components/study/ui/StudyFilterSection";
import { StudyListMobileHeader } from "@/components/study/ui/StudyListMobileHeader";
import { StudyResultsHeader } from "@/components/study/ui/StudyResultsHeader";
import { useStudyData, useStudyFilters } from "@/hooks/study";
import { useDebounce } from "@/hooks/useDebounce";
import { Study, StudyListParams } from "@/types/study";
import { getStudyTagName } from "@/constants/study-tags";
import { Pagination } from "@ui/components/client";
import { Heading } from "@ui/components/server";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type StudySort = "latest" | "oldest";

function compareStudySemester(a: Study, b: Study) {
  const yearDiff = a.act_year - b.act_year;
  if (yearDiff !== 0) return yearDiff;

  const semesterDiff = a.act_semester - b.act_semester;
  if (semesterDiff !== 0) return semesterDiff;

  return a.id - b.id;
}

export default function StudyListPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<StudySort>("latest");
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedSearch = useDebounce(searchInput, 500);

  const { filters, updateFilter, updateMultipleFilters, clearAllFilters } =
    useStudyFilters();

  const [pageSize, setPageSize] = useState(12);
  const [fetchSize, setFetchSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(0);
  const resetPage = useCallback(() => setCurrentPage(0), []);

  useEffect(() => {
    resetPage();
    updateFilter("search", debouncedSearch || undefined);
  }, [debouncedSearch, resetPage, updateFilter]);

  const apiParams: StudyListParams = useMemo(() => {
    const studyTagName = filters.tag ? getStudyTagName(filters.tag) : null;

    return {
      page: 0,
      size: fetchSize,
      year: filters.year,
      semester: filters.semester,
      difficulties: filters.difficulty ? [filters.difficulty] : undefined,
      tags: studyTagName ? [studyTagName] : undefined,
      recruit_status: filters.recruitStatus,
      search: filters.search,
    };
  }, [
    fetchSize,
    filters.year,
    filters.semester,
    filters.difficulty,
    filters.tag,
    filters.recruitStatus,
    filters.search,
  ]);

  const { studies, loading, error, totalElements, refetch } =
    useStudyData(apiParams);

  useEffect(() => {
    refetch(apiParams);
  }, [apiParams, refetch]);

  useEffect(() => {
    const nextFetchSize = Math.max(totalElements, pageSize);
    setFetchSize((prev) => (prev === nextFetchSize ? prev : nextFetchSize));
  }, [pageSize, totalElements]);

  const sortedStudies = useMemo(() => {
    const direction = sortBy === "latest" ? -1 : 1;

    return [...studies].sort((a, b) => compareStudySemester(a, b) * direction);
  }, [sortBy, studies]);

  const paginatedStudies = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return sortedStudies.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, sortedStudies]);

  const handleCardClick = (study: Study) => {
    router.push(`/studies/detail/${study.id}`);
  };

  const handleApplyClick = (study: Study) => {
    router.push(`/studies/detail/${study.id}/apply`);
  };

  if (error) {
    return (
      <div className="bg-bg-base min-h-viewport flex items-center justify-center">
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
    resetPage();
    if (value) {
      const [year, semester] = value.split("-").map(Number);
      updateMultipleFilters({ year, semester });
    } else {
      updateMultipleFilters({ year: undefined, semester: undefined });
    }
  };

  const handleDifficultyChange = (value: string) => {
    resetPage();
    updateFilter("difficulty", value || undefined);
  };

  const handleTagChange = (value: string) => {
    resetPage();
    updateFilter("tag", value || undefined);
  };

  const handleClearAllFilters = () => {
    resetPage();
    clearAllFilters();
  };

  const handlePageSizeChange = (size: number) => {
    resetPage();
    setPageSize(size);
  };

  const handleSortChange = (sort: StudySort) => {
    resetPage();
    setSortBy(sort);
  };

  return (
    <div className="bg-bg-base min-h-viewport pb-20">
      <div className="w-full pb-8">
        <Heading size="l" className="mb-6 md:mb-12">
          스터디 목록
        </Heading>

        <StudyListMobileHeader
          searchInput={searchInput}
          onSearchChange={(value) => setSearchInput(value)}
          onSearchSubmit={() => {
            updateFilter("search", searchInput || undefined);
            resetPage();
          }}
          selectedSemester={selectedSemester}
          selectedDifficulty={filters.difficulty || ""}
          selectedTag={filters.tag || ""}
          onSemesterChange={handleSemesterChange}
          onDifficultyChange={handleDifficultyChange}
          onTagChange={handleTagChange}
          onClearAllFilters={handleClearAllFilters}
          totalItems={totalElements}
          loading={loading}
        />

        <div className="hidden md:block">
          <div className="mb-6 flex items-center justify-between gap-7">
            <StudySearchBar
              value={searchInput}
              onChange={(value) => setSearchInput(value)}
              onSubmit={() => {
                updateFilter("search", searchInput || undefined);
                resetPage();
              }}
            />
            <StudyActionButtons
              onCreateClick={() => router.push("/studies/create")}
            />
          </div>

          <div className="mb-7">
            <StudyFilterSection
              selectedSemester={selectedSemester}
              selectedDifficulty={filters.difficulty || ""}
              selectedTag={filters.tag || ""}
              onSemesterChange={handleSemesterChange}
              onDifficultyChange={handleDifficultyChange}
              onTagChange={handleTagChange}
              onClearAll={handleClearAllFilters}
            />
          </div>

          <div className="mb-6">
            <StudyResultsHeader
              totalItems={totalElements}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        {loading ? (
          <StudyListSkeleton />
        ) : (
          <>
            <div className="mb-10">
              <StudyCardGrid
                studies={paginatedStudies}
                onCardClick={handleCardClick}
                onApplyClick={handleApplyClick}
              />
            </div>

            {totalElements > 0 && (
              <Pagination
                currentPage={currentPage + 1}
                totalPages={Math.ceil(totalElements / pageSize) || 1}
                onPageChange={(page) => setCurrentPage(page - 1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
