"use client";

import { InstagramIcon } from "@repo/assets/icons/krds";
import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import Link from "next/link";
import { useState } from "react";
import { FORIF_EXTERNAL_LINKS } from "@/constants/external-links";
import { useHorizontalSwipe } from "@/hooks/useHorizontalSwipe";
import styles from "./home-animations.module.css";

export type InstagramPost = {
  id: string;
  caption: string;
  imageUrl: string;
  permalink: string;
  mediaType: "CAROUSEL_ALBUM" | "IMAGE" | "VIDEO";
};

export function InstagramSectionClient({ posts }: { posts: InstagramPost[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(posts.length / 3);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages - 1, 0));
  const visiblePosts = posts.slice(
    safeCurrentPage * 3,
    safeCurrentPage * 3 + 3,
  );

  const selectPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  const swipeHandlers = useHorizontalSwipe({
    onSwipeLeft: () => selectPage(safeCurrentPage + 1),
    onSwipeRight: () => selectPage(safeCurrentPage - 1),
  });

  return (
    <section className="max-w-main mx-auto w-full px-4 lg:px-0">
      <div className="mb-6">
        <div>
          <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
            SNS
          </h2>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-[#e5e8eb] bg-white px-6 text-center">
          <InstagramIcon width={40} height={40} />
          <p className="text-text-basic mt-3 text-[16px] font-semibold">
            FORIF의 새로운 소식을 인스타그램에서 만나보세요.
          </p>
          <Link
            href={FORIF_EXTERNAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-[15px] font-medium text-[#052b57] hover:underline"
          >
            @forif_hyu 방문하기
          </Link>
        </div>
      ) : (
        <>
          <div className="touch-pan-y" {...swipeHandlers}>
            <div
              key={safeCurrentPage}
              className={`${styles.bannerSlideForward} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`}
            >
              {visiblePosts.map((post) => (
                <InstagramCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => selectPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 0}
                aria-label="이전 인스타그램 게시물"
                className="text-text-basic flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e8eb] bg-white transition-colors hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={20} />
              </button>
              <div
                className="flex items-center gap-2"
                aria-label="인스타그램 게시물 페이지"
              >
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectPage(index)}
                    aria-label={`${index + 1}번째 인스타그램 게시물 묶음`}
                    aria-current={
                      safeCurrentPage === index ? "true" : undefined
                    }
                    className={`h-2 rounded-full transition-all ${
                      safeCurrentPage === index
                        ? "w-8 bg-[#052b57]"
                        : "w-2 bg-[#d8dee5] hover:bg-[#9aa7b4]"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => selectPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages - 1}
                aria-label="다음 인스타그램 게시물"
                className="text-text-basic flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e8eb] bg-white transition-colors hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function InstagramCard({ post }: { post: InstagramPost }) {
  return (
    <Link
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group overflow-hidden rounded-2xl border border-[#e5e8eb] bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-[#eef2f6]">
        {/* Instagram CDN URL은 짧은 수명을 가지므로 최적화 서버를 거치지 않는다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt="FORIF 인스타그램 게시물"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {post.mediaType === "VIDEO" && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            VIDEO
          </span>
        )}
      </div>
      <p className="text-text-subtle line-clamp-3 min-h-[5.25rem] px-5 py-4 text-[15px] leading-7">
        {post.caption}
      </p>
    </Link>
  );
}
