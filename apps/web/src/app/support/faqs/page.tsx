"use client";

import { useEffect, useState } from "react";

import { Pagination } from "@ui/components/client";
import { Breadcrumb } from "@ui/components/server";

import { SearchBar } from "@/features/support/components/SearchBar";
import { SearchResultCount } from "@/features/support/components/SearchResultCount";
import { useSearchPagination } from "@/features/support/hooks/useSearchPagination";

import { useFaqList } from "@/features/support/faqs/hooks/useFaqList";
import { FaqAccordionList } from "@/features/support/faqs/components/FaqAccordionList";

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
    <main className="mx-auto w-full max-w-[1100px] px-6 py-10">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "지원", href: "/support" },
            { label: "자주 묻는 질문" },
          ]}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">자주 묻는 질문</h1>
      </div>

      <SearchBar
        value={draftQuery}
        onChange={setDraftQuery}
        onSearch={handleSearch}
        placeholder="자주 묻는 질문을 찾아보세요"
      />

      <SearchResultCount count={total} />

      {isLoading && (
        <div className="py-12 text-center text-sm text-gray-500">
          불러오는 중...
        </div>
      )}

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
        <FaqAccordionList key={query} items={items} />
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
