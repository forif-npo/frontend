"use client";

import { useEffect, useState } from "react";

import { Pagination } from "@ui/components/client";
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

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const { items, total, totalPages, isLoading, errorMessage } = useFaqList({
    query,
    page,
    pageSize: PAGE_SIZE,
  });

  const handleSearch = () => {
    setPage(1);
    setQuery(draftQuery);
  };

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "지원" },
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

      <SearchResultCount count={total} />

      {isLoading && <FaqListSkeleton />}

      {errorMessage && !isLoading && (
        <div className="py-12 text-center text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && items.length === 0 && (
        <div className="py-12 text-center text-sm text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}

      {!isLoading && !errorMessage && items.length > 0 && (
        <FaqAccordionList
          key={`${query}-${page}`}
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
