import type { ProductSourceType, ProductStatus } from "./api";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  LIVE: "서비스 중",
  DEV: "개발 중",
  PAUSED: "운영 중단",
  RETIRED: "서비스 종료",
};

export const PRODUCT_STATUS_BADGE_VARIANTS: Record<
  ProductStatus,
  "primary" | "success" | "warning" | "danger" | "disabled" | "info"
> = {
  LIVE: "success",
  DEV: "info",
  PAUSED: "warning",
  RETIRED: "disabled",
};

export const PRODUCT_SOURCE_LABELS: Record<ProductSourceType, string> = {
  STUDY: "스터디",
  HACKATHON: "해커톤",
  SIDE: "자율 프로젝트",
};

/** 목록 상단 필터 탭: 전체 + 출처별 */
export const PRODUCT_SOURCE_FILTERS = [
  { value: "ALL", label: "전체" },
  { value: "STUDY", label: "스터디" },
  { value: "HACKATHON", label: "해커톤" },
  { value: "SIDE", label: "자율 프로젝트" },
] as const;

export type ProductSourceFilter =
  (typeof PRODUCT_SOURCE_FILTERS)[number]["value"];
