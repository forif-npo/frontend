"use client";

import { safeImageSrc } from "@/utils/image";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const DEFAULT_FALLBACK_SRC = "/images/default-study-img.png";
const DEFAULT_FALLBACK_CLASSNAME = "object-contain p-8 opacity-80";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
  /** 폴백 이미지에 적용할 className. 원본을 꽉 채우지 않고 작게 보여준다. */
  fallbackClassName?: string;
};

/**
 * 로드 실패 시 대체 이미지로 폴백하는 next/image 래퍼.
 *
 * 외부(미디움 썸네일 등)나 옛 데이터의 이미지 URL은 remotePatterns 미등록
 * 호스트이거나 이미 삭제돼 로드가 실패하는 경우가 있다. safeImageSrc로 유효성을
 * 1차 검증하고, 실제 로드에 실패하면 onError로 fallbackSrc를 노출한다.
 *
 * 폴백 이미지는 원본처럼 object-cover로 꽉 채우면 어색하므로, fallbackClassName
 * (기본 object-contain + 여백)을 적용해 영역 안에서 작게 보여준다.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  fallbackClassName = DEFAULT_FALLBACK_CLASSNAME,
  ...props
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);
  const validSrc = safeImageSrc(src);
  const isFallback = errored || validSrc === null;

  return (
    <Image
      src={isFallback ? fallbackSrc : validSrc!}
      alt={alt}
      onError={() => setErrored(true)}
      className={isFallback ? fallbackClassName : className}
      {...props}
    />
  );
}
