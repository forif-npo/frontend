import type { ProductOperationStatus } from "./api";

export { PRODUCT_SOURCE_LABELS } from "@core/products";

export const PRODUCT_OPERATION_STATUS_BADGE_VARIANTS: Record<
  ProductOperationStatus,
  "primary" | "success" | "warning" | "danger" | "disabled" | "info"
> = {
  LIVE: "success",
  PAUSED: "warning",
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
