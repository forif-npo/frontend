"use client";

import { useEffect, useState } from "react";

import { Pagination, RadioButtonGroup } from "@ui/components/client";
import { EmptyState, InlineErrorState } from "@ui/components/server";
import { SearchBar } from "@/features/support/components/SearchBar";
import { SearchResultCount } from "@/features/support/components/SearchResultCount";
import { useSearchPagination } from "@/features/support/hooks/useSearchPagination";

import { useFaqList } from "@/features/support/faqs/hooks/useFaqList";
import { FaqAccordionList } from "@/features/support/faqs/components/FaqAccordionList";
import { FaqListSkeleton } from "@/components/skeleton/SupportListSkeleton";
import { PageHeader } from "@/components/PageHeader";

const PAGE_SIZE = 10;

export default function FaqPage() {
  const { query, page, setPage, setQuery } = useSearchPagination({
    defaultQuery: "",
    defaultPage: 1,
  });

  const [draftQuery, setDraftQuery] = useState(query);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const { items, total, totalPages, categories, isLoading, errorMessage } =
    useFaqList({
      query,
      category,
      page,
      pageSize: PAGE_SIZE,
    });

  const handleSearch = () => {
    setPage(1);
    setQuery(draftQuery);
  };

  const categoryOptions = [
    { value: "", label: "전체" },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  const handleCategoryChange = (nextCategory: string) => {
    setPage(1);
    setCategory(nextCategory);
  };

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "공지" },
          { label: "자주 묻는 질문" },
        ]}
        title="자주 묻는 질문"
        description="FORIF 이용 중 자주 묻는 질문의 답변을 확인하세요."
      />

      <SearchBar
        value={draftQuery}
        onChange={setDraftQuery}
        onSearch={handleSearch}
        placeholder="자주 묻는 질문을 찾아보세요"
      />

      {!isLoading && categoryOptions.length > 0 && (
        <div className="mt-8">
          <RadioButtonGroup
            name="faq-category"
            options={categoryOptions}
            selectedValue={category}
            onChange={handleCategoryChange}
            size="sm"
            direction="horizontal"
            className="flex-wrap gap-x-10 gap-y-3"
          />
        </div>
      )}

      <SearchResultCount count={total} className="mt-8" />

      {isLoading && <FaqListSkeleton />}

      {errorMessage && !isLoading && (
        <InlineErrorState message={errorMessage} />
      )}

      {!isLoading && !errorMessage && items.length === 0 && (
        <EmptyState title="검색 결과가 없습니다." />
      )}

      {!isLoading && !errorMessage && items.length > 0 && (
        <FaqAccordionList
          key={`${query}-${category}-${page}`}
          items={items}
          hasQuery={!!query}
        />
      )}

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}
