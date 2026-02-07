import { CalendarDays } from "@repo/assets/icons/lucide";

// TODO: 론칭 후 주석 해제
// import { ChevronRight } from "@repo/assets/icons/lucide";
// import Link from "next/link";
// import { newsData } from "@/mocks/data/home";
//
// export function MobileFAQSection() {
//   const faqs = newsData.filter((news) => news.category === "faq").slice(0, 3);
//
//   return (
//     <div className="flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-1">
//           <CalendarDays size={24} strokeWidth={1.5} className="text-text-basic" />
//           <span className="text-[19px] font-bold leading-[1.5] text-black">자주 묻는 질문</span>
//         </div>
//         <Link href="/faq" className="flex h-8 items-center gap-1 px-0.5 text-[17px] leading-[1.5] text-[#1e2124]">
//           더보기
//           <ChevronRight size={20} className="text-[#1e2124]" />
//         </Link>
//       </div>
//       <div className="flex flex-col gap-4">
//         {faqs.length > 0 ? (
//           faqs.map((faq) => (
//             <p key={faq.id} className="truncate text-[17px] leading-[1.5] text-black">{faq.title}</p>
//           ))
//         ) : (
//           <>
//             <p className="truncate text-[17px] leading-[1.5] text-black">이 파이썬 스터디 듣고 개발자되면 책임 못 짐</p>
//             <p className="truncate text-[17px] leading-[1.5] text-black">이 파이썬 스터디 듣고 개발자되면 책임 못 짐</p>
//             <p className="truncate text-[17px] leading-[1.5] text-black">이 파이썬 스터디 듣고 개발자되면 책임 못 짐</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

export function MobileFAQSection() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-1">
        <CalendarDays size={24} strokeWidth={1.5} className="text-text-basic" />
        <span className="text-[19px] font-bold leading-[1.5] text-black">
          자주 묻는 질문
        </span>
      </div>
      <p className="text-text-subtle text-[15px] leading-[1.5]">
        곧 론칭 예정입니다
      </p>
    </div>
  );
}
