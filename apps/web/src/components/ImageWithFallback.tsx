"use client";

import { safeImageSrc } from "@/utils/image";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_FALLBACK_SRC = "/images/default-study-img.png";
const DEFAULT_FALLBACK_CLASSNAME = "object-contain p-8 opacity-80";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
  /** 원본 이미지 로드 실패 시 순서대로 시도할 이미지 URL 목록. */
  fallbackSources?: Array<string | null | undefined>;
  /** Next 이미지 최적화 경로를 거치지 않고 브라우저에서 원본 URL을 직접 불러온다. */
  native?: boolean;
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
  fallbackSources = [],
  fallbackClassName = DEFAULT_FALLBACK_CLASSNAME,
  native = false,
  ...props
}: ImageWithFallbackProps) {
  const validSources = [src, ...fallbackSources]
    .map(safeImageSrc)
    .filter((source): source is string => source !== null);
  const sourceKey = validSources.join("\u0000");
  const [failedSources, setFailedSources] = useState<string[]>([]);

  useEffect(() => {
    setFailedSources([]);
  }, [sourceKey]);

  const currentSrc =
    validSources.find((source) => !failedSources.includes(source)) ??
    fallbackSrc;
  const isFallback = currentSrc === fallbackSrc;
  const imageClassName = isFallback ? fallbackClassName : className;

  if (native) {
    return (
      // 외부 이미지 URL은 Next 이미지 최적화 서버의 remotePatterns 영향을 받지 않도록 직접 로드한다.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentSrc}
        alt={alt}
        className={`${props.fill ? "absolute inset-0 h-full w-full" : ""} ${imageClassName ?? ""}`}
        onError={() => {
          if (!isFallback) {
            setFailedSources((sources) =>
              sources.includes(currentSrc) ? sources : [...sources, currentSrc],
            );
          }
        }}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (!isFallback) {
          setFailedSources((sources) =>
            sources.includes(currentSrc) ? sources : [...sources, currentSrc],
          );
        }
      }}
      className={imageClassName}
      {...props}
    />
  );
}
