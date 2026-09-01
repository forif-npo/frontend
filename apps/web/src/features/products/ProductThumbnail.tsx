"use client";

import { useEffect, useState } from "react";
import { safeImageSrc } from "@/utils/image";

interface ProductThumbnailProps {
  slug: string;
  name: string;
  thumbnailUrl: string | null;
  className?: string;
}

/** 썸네일이 없는 서비스에 slug 기반 고정 그라디언트를 보여준다 */
const GRADIENTS = [
  "from-primary-60 to-primary-40",
  "from-secondary-70 to-primary-60",
  "from-success-70 to-success-30",
  "from-point-70 to-point-30",
  "from-warning-50 to-warning-20",
  "from-graphic-70 to-graphic-30",
];

function gradientFor(slug: string) {
  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) % GRADIENTS.length ** 2;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

export function ProductThumbnail({
  slug,
  name,
  thumbnailUrl,
  className = "",
}: ProductThumbnailProps) {
  // 업로드된 이미지는 삭제·이동될 수 있으므로 로드 실패 시 그라디언트로 되돌린다
  const validSrc = safeImageSrc(thumbnailUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [validSrc]);

  if (validSrc && !hasError) {
    return (
      <div className={`bg-graphic-10 relative overflow-hidden ${className}`}>
        {/* 서비스 신청 응답의 업로드 URL은 브라우저에서 직접 불러와 remotePatterns 설정에 영향받지 않는다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={validSrc}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradientFor(slug)} ${className}`}
    >
      <span className="text-text-inverse-static select-none text-[40px] font-bold tracking-tight">
        {name.slice(0, 1)}
      </span>
    </div>
  );
}
