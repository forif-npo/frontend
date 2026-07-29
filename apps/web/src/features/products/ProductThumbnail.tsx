"use client";

import Image from "next/image";
import { useState } from "react";
import { safeImageSrc } from "@/utils/image";

interface ProductThumbnailProps {
  slug: string;
  name: string;
  thumbnailUrl: string | null;
  className?: string;
}

/** 썸네일이 없는 서비스에 slug 기반 고정 그라디언트를 보여준다 */
const GRADIENTS = [
  "from-[#0b50d0] to-[#4f8ef7]",
  "from-[#063a74] to-[#0b50d0]",
  "from-[#2c7a5b] to-[#5fc39a]",
  "from-[#7a4fc3] to-[#b18cf0]",
  "from-[#c05621] to-[#f0a05a]",
  "from-[#31597f] to-[#7fa8cf]",
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
  const [hasError, setHasError] = useState(false);
  const validSrc = safeImageSrc(thumbnailUrl);

  if (validSrc && !hasError) {
    return (
      <div className={`relative overflow-hidden bg-[#DFE8F4] ${className}`}>
        <Image
          src={validSrc}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradientFor(slug)} ${className}`}
    >
      <span className="select-none text-[40px] font-bold tracking-tight text-white/90">
        {name.slice(0, 1)}
      </span>
    </div>
  );
}
