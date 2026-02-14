"use client";

import { useState } from "react";

import { Pagination } from "@ui/components/client";
import { Breadcrumb } from "@ui/components/server";

import { SearchBar } from "@/features/support/components/SearchBar";
import { SearchResultCount } from "@/features/support/components/SearchResultCount";
import { useSearchPagination } from "@/features/support/hooks/useSearchPagination";
import { useAnnouncementList } from "@/features/support/announcements/hooks/useAnnouncementList";
import { AnnouncementList } from "@/features/support/announcements/components/AnnouncementList";

const PAGE_SIZE = 10;

export default function AnnouncementPage() {
  const { query, page, setPage, setQuery } = useSearchPagination({
    defaultQuery: "",
    defaultPage: 1,
  });

  // “라우트 진입 시 전체 조회”는 query="" 상태로 이미 충족
  // “버튼 눌렀을 때 검색 수행”을 원하시면 입력값을 따로 들고 있다가 제출 시 setQuery 하는 구조로 갑니다.
  const [inputValue, setInputValue] = useState(query);

  const { items, total, totalPages, isLoading, errorMessage } =
    useAnnouncementList({
      query,
      page,
      pageSize: PAGE_SIZE,
    });

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-10">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "지원", href: "/support" },
            { label: "공지사항" },
          ]}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">공지사항</h1>
      </div>

      <SearchBar
        value={inputValue}
        onChange={(v) => setInputValue(v)}
        placeholder="공지사항을 찾아보세요"
        onSearch={() => {
          setPage(1);
          setQuery(inputValue);
        }}
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

      {!isLoading && !errorMessage && <AnnouncementList items={items} />}

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
