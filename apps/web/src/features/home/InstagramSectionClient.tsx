"use client";

import { InstagramIcon } from "@repo/assets/icons/krds";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
} from "@repo/assets/icons/lucide";
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
  likeCount: number;
  commentsCount: number;
};

export function InstagramSectionClient({ posts }: { posts: InstagramPost[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(posts.length / 4);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages - 1, 0));
  const visiblePosts = posts.slice(
    safeCurrentPage * 4,
    safeCurrentPage * 4 + 4,
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
        <div className="border-border-gray-light bg-surface-white flex min-h-52 flex-col items-center justify-center rounded-2xl border px-6 text-center">
          <InstagramIcon width={40} height={40} />
          <p className="text-text-basic mt-3 text-[16px] font-semibold">
            FORIF의 새로운 소식을 인스타그램에서 만나보세요.
          </p>
          <Link
            href={FORIF_EXTERNAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary mt-4 text-[15px] font-medium hover:underline"
          >
            @forif_hyu 방문하기
          </Link>
        </div>
      ) : (
        <>
          <div className="touch-pan-y" {...swipeHandlers}>
            <div
              key={safeCurrentPage}
              className={`${styles.bannerSlideForward} bg-border-gray-darker grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4`}
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
                className="text-text-basic border-border-gray-light bg-surface-white hover:bg-action-secondary-hover flex h-10 w-10 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
                        ? "bg-secondary-80 w-8"
                        : "bg-gray-20 hover:bg-gray-40 w-2"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => selectPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages - 1}
                aria-label="다음 인스타그램 게시물"
                className="text-text-basic border-border-gray-light bg-surface-white hover:bg-action-secondary-hover flex h-10 w-10 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
      aria-label={`FORIF 인스타그램 게시물: ${post.caption}`}
      className="bg-surface-gray-subtle focus-visible:outline-border-secondary group relative aspect-square overflow-hidden transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {/* Instagram CDN URL은 짧은 수명을 가지므로 최적화 서버를 거치지 않는다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt=""
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="bg-alpha-black75 text-text-inverse-static absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="line-clamp-2 text-center text-[14px] leading-5 sm:text-[15px] sm:leading-6">
          {post.caption}
        </p>
        <div className="mt-5 flex items-center gap-7 text-[22px] font-bold leading-none">
          <span className="flex items-center gap-1.5">
            <Heart size={30} fill="currentColor" aria-hidden="true" />
            {post.likeCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={30} fill="currentColor" aria-hidden="true" />
            {post.commentsCount.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
