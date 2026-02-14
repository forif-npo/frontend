// TODO: 론칭 후 주석 해제
// "use client";
//
// import { useState } from "react";
// import { Label } from "@ui/components/server";
// import Link from "next/link";
// import { newsData } from "@/mocks/data/home";
// import type { NewsData } from "@/mocks/data/home";
// import { NewsCard } from "./NewsCard";
//
// const CATEGORIES = [
//   { key: "all", label: "전체" },
//   { key: "notice", label: "공지사항" },
//   { key: "blog", label: "기술 블로그" },
//   { key: "faq", label: "자주묻는 질문" },
// ] as const;
//
// type CategoryKey = (typeof CATEGORIES)[number]["key"];
//
// function filterNews(category: CategoryKey): NewsData[] {
//   if (category === "all") return newsData;
//   return newsData.filter((news) => news.category === category);
// }
//
// export function NewsSection() {
//   const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
//   const filteredNews = filterNews(activeCategory);
//
//   return (
//     <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-0">
//       <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l mb-6 font-bold">
//         뉴스
//       </h2>
//       <div className="mb-6 flex items-center gap-4">
//         <div role="tablist" aria-label="뉴스 카테고리" className="flex flex-1 gap-2">
//           {CATEGORIES.map((cat) => {
//             const isSelected = activeCategory === cat.key;
//             return (
//               <button key={cat.key} role="tab" aria-selected={isSelected}
//                 onClick={() => setActiveCategory(cat.key)}
//                 className={`cursor-pointer px-1 py-2 text-[17px] font-bold leading-[1.5] transition-colors ${
//                   isSelected
//                     ? "border-secondary text-text-secondary border-b-[3px]"
//                     : "text-text-subtle hover:text-text-basic border-b-[3px] border-transparent"
//                 }`}
//                 style={{ minWidth: 56 }}
//               >
//                 {cat.label}
//               </button>
//             );
//           })}
//         </div>
//         <Link href="/news" className="flex shrink-0 items-center gap-1 max-sm:hidden">
//           <span className="text-text-basic text-[17px] leading-[1.5] hover:underline">더보기</span>
//           <span className="text-text-basic text-[20px] leading-none">+</span>
//         </Link>
//       </div>
//       <div className="flex flex-col gap-6">
//         {filteredNews.length > 0 ? (
//           <>
//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//               {filteredNews.slice(0, 2).map((news) => (
//                 <NewsCard key={news.id} news={news} />
//               ))}
//             </div>
//             {filteredNews.length > 2 && (
//               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//                 {filteredNews.slice(2, 4).map((news) => (
//                   <NewsCard key={news.id} news={news} />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <p className="text-text-subtle py-12 text-center">해당 카테고리의 뉴스가 없습니다.</p>
//         )}
//       </div>
//     </section>
//   );
// }

export function NewsSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-0">
      <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l mb-6 font-bold">
        뉴스
      </h2>
      <div className="border-divider-gray-light rounded-3 flex flex-col items-center justify-center border py-20">
        <p className="text-text-basic text-lg font-semibold">
          곧 론칭 예정입니다
        </p>
        <p className="text-text-subtle mt-2 text-sm">
          공지사항, 기술 블로그, FAQ 등 다양한 소식을 전해드릴 예정이에요.
        </p>
      </div>
    </section>
  );
}
