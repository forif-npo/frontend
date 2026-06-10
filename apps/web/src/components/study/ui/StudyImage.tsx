"use client";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { ComponentProps } from "react";

/**
 * 스터디 이미지 전용 래퍼.
 *
 * 옛날 스터디는 remotePatterns에 등록되지 않은 호스트나 이미 삭제된 URL을
 * 가리키는 경우가 있어 이미지 로드가 실패한다. 이때 기본 스터디 이미지로
 * 폴백 처리해 깨진 이미지가 노출되지 않도록 한다.
 */
export function StudyImage(
  props: Omit<ComponentProps<typeof ImageWithFallback>, "fallbackSrc">,
) {
  return <ImageWithFallback {...props} />;
}
