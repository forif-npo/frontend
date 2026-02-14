import { CalendarDays } from "@repo/assets/icons/lucide";

// TODO: 론칭 후 주석 해제
// import { ChevronRight } from "@repo/assets/icons/lucide";
// import Link from "next/link";
//
// export function MobileBlogSection() {
//   return (
//     <div className="mb-6 flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-1">
//           <CalendarDays size={24} strokeWidth={1.5} className="text-text-basic" />
//           <span className="text-[19px] font-bold leading-[1.5] text-black">기술 블로그</span>
//         </div>
//         <Link href="https://medium.com/forif" target="_blank" rel="noopener noreferrer"
//           className="flex h-8 items-center gap-1 px-0.5 text-[17px] leading-[1.5] text-[#1e2124]">
//           더보기
//           <ChevronRight size={20} className="text-[#1e2124]" />
//         </Link>
//       </div>
//       <p className="text-[17px] leading-[1.5] text-black">
//         포리프는 자체 기술 블로그를 운영하고 있습니다. 미디움을 통해 확인할 수 있습니다.
//       </p>
//     </div>
//   );
// }

export function MobileBlogSection() {
  return (
    <div className="mb-6 flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-1">
        <CalendarDays size={24} strokeWidth={1.5} className="text-text-basic" />
        <span className="text-[19px] font-bold leading-[1.5] text-black">
          기술 블로그
        </span>
      </div>
      <p className="text-text-subtle text-[15px] leading-[1.5]">
        곧 론칭 예정입니다
      </p>
    </div>
  );
}
